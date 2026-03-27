from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
from passlib.context import CryptContext


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Security
SECRET_KEY = os.environ['JWT_SECRET_KEY']
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 480

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Admin credentials from environment
ADMIN_USERNAME = os.environ['ADMIN_USERNAME']
ADMIN_PASSWORD_HASH = os.environ['ADMIN_PASSWORD_HASH']

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    price: float
    category: str
    image_url: str

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    category: str
    image_url: str

class OrderItem(BaseModel):
    product_id: str
    name: str
    price: float
    quantity: int

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    items: List[OrderItem]
    address: str
    observations: Optional[str] = ""
    delivery_fee: float
    total: float
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderCreate(BaseModel):
    items: List[OrderItem]
    address: str
    observations: Optional[str] = ""
    delivery_fee: float
    total: float

class Settings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default="settings")
    whatsapp_number: str

class SettingsUpdate(BaseModel):
    whatsapp_number: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

# Auth functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return username
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Routes
@api_router.get("/")
async def root():
    return {"message": "Ricardo ZapDelivery API"}

@api_router.post("/auth/login", response_model=Token)
async def login(credentials: LoginRequest):
    if credentials.username != ADMIN_USERNAME:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(credentials.password, ADMIN_PASSWORD_HASH):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": credentials.username})
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.get("/products", response_model=List[Product])
async def get_products(category: Optional[str] = None):
    query = {}
    if category and category != "todos":
        query["category"] = category
    
    products = await db.products.find(query, {"_id": 0}).to_list(1000)
    return products

@api_router.post("/products", response_model=Product)
async def create_product(product: ProductCreate):
    product_obj = Product(**product.model_dump())
    doc = product_obj.model_dump()
    await db.products.insert_one(doc)
    return product_obj

@api_router.post("/seed-products")
async def seed_products():
    # Check if products already exist
    count = await db.products.count_documents({})
    if count > 0:
        return {"message": "Products already seeded", "count": count}
    
    products = [
        # Hambúrgueres
        {
            "id": str(uuid.uuid4()),
            "name": "Classic Burger",
            "description": "Hambúrguer 180g, queijo cheddar, alface, tomate, cebola roxa e molho especial",
            "price": 28.90,
            "category": "hamburgueres",
            "image_url": "https://images.unsplash.com/photo-1662452883375-9226ea22c765?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwYnVyZ2VyJTIwZGFyayUyMGJhY2tncm91bmR8ZW58MHx8fHwxNzc0Mzk5OTc1fDA&ixlib=rb-4.1.0&q=85"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Bacon Supreme",
            "description": "Dois hambúrgueres 180g, bacon crocante, queijo cheddar duplo, cebola caramelizada",
            "price": 36.90,
            "category": "hamburgueres",
            "image_url": "https://images.unsplash.com/photo-1673166516558-3f1b88a22db8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHw0fHxnb3VybWV0JTIwYnVyZ2VyJTIwZGFyayUyMGJhY2tncm91bmR8ZW58MHx8fHwxNzc0Mzk5OTc1fDA&ixlib=rb-4.1.0&q=85"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Chicken Crispy",
            "description": "Filé de frango empanado, queijo, alface americana, tomate e maionese artesanal",
            "price": 26.90,
            "category": "hamburgueres",
            "image_url": "https://images.pexels.com/photos/4315148/pexels-photo-4315148.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Monster Burger",
            "description": "Triplo de carne 180g cada, triplo queijo, bacon, ovo, calabresa acebolada",
            "price": 45.90,
            "category": "hamburgueres",
            "image_url": "https://images.pexels.com/photos/109400/pexels-photo-109400.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Veggie Deluxe",
            "description": "Hambúrguer de grão de bico, queijo vegetal, rúcula, tomate seco, molho pesto",
            "price": 29.90,
            "category": "hamburgueres",
            "image_url": "https://images.unsplash.com/photo-1611309454921-16cef3438ee0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwyfHxnb3VybWV0JTIwYnVyZ2VyJTIwZGFyayUyMGJhY2tncm91bmR8ZW58MHx8fHwxNzc0Mzk5OTc1fDA&ixlib=rb-4.1.0&q=85"
        },
        # Acompanhamentos
        {
            "id": str(uuid.uuid4()),
            "name": "Batata Frita Grande",
            "description": "Porção de batatas fritas crocantes com sal especial",
            "price": 14.90,
            "category": "acompanhamentos",
            "image_url": "https://images.pexels.com/photos/7479383/pexels-photo-7479383.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Onion Rings",
            "description": "Anéis de cebola empanados e fritos, servidos com molho barbecue",
            "price": 16.90,
            "category": "acompanhamentos",
            "image_url": "https://images.pexels.com/photos/5695624/pexels-photo-5695624.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Nuggets (10 unidades)",
            "description": "Nuggets de frango crocantes com molho à sua escolha",
            "price": 18.90,
            "category": "acompanhamentos",
            "image_url": "https://images.pexels.com/photos/5695624/pexels-photo-5695624.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        },
        # Bebidas
        {
            "id": str(uuid.uuid4()),
            "name": "Coca-Cola Lata 350ml",
            "description": "Refrigerante Coca-Cola gelado",
            "price": 6.00,
            "category": "bebidas",
            "image_url": "https://images.unsplash.com/photo-1639834482101-5f332c3b701f?crop=entropy&cs=srgb&fm=jpg&q=85"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Coca-Cola 2L",
            "description": "Refrigerante Coca-Cola 2 litros",
            "price": 12.00,
            "category": "bebidas",
            "image_url": "https://images.pexels.com/photos/4113670/pexels-photo-4113670.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Suco Natural Laranja 500ml",
            "description": "Suco natural de laranja",
            "price": 10.00,
            "category": "bebidas",
            "image_url": "https://images.unsplash.com/photo-1639834482101-5f332c3b701f?crop=entropy&cs=srgb&fm=jpg&q=85"
        },
        # Sobremesas
        {
            "id": str(uuid.uuid4()),
            "name": "Brownie com Sorvete",
            "description": "Brownie de chocolate quente com sorvete de creme e calda",
            "price": 15.90,
            "category": "sobremesas",
            "image_url": "https://images.pexels.com/photos/4113670/pexels-photo-4113670.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Milkshake Chocolate",
            "description": "Milkshake cremoso de chocolate com chantilly",
            "price": 18.90,
            "category": "sobremesas",
            "image_url": "https://images.pexels.com/photos/4113670/pexels-photo-4113670.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        }
    ]
    
    await db.products.insert_many(products)
    return {"message": "Products seeded successfully", "count": len(products)}

@api_router.post("/orders", response_model=Order)
async def create_order(order: OrderCreate):
    order_obj = Order(**order.model_dump())
    doc = order_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.orders.insert_one(doc)
    return order_obj

@api_router.get("/settings")
async def get_settings():
    settings = await db.settings.find_one({"id": "settings"}, {"_id": 0})
    if not settings:
        # Create default settings if not exists
        default_settings = {
            "id": "settings",
            "whatsapp_number": "5512988043993"
        }
        await db.settings.insert_one(default_settings)
        return default_settings
    return settings

# Admin routes (protected)
@api_router.get("/admin/products", response_model=List[Product])
async def admin_get_products(username: str = Depends(verify_token)):
    products = await db.products.find({}, {"_id": 0}).to_list(1000)
    return products

@api_router.post("/admin/products", response_model=Product)
async def admin_create_product(product: ProductCreate, username: str = Depends(verify_token)):
    product_obj = Product(**product.model_dump())
    doc = product_obj.model_dump()
    await db.products.insert_one(doc)
    return product_obj

@api_router.put("/admin/products/{product_id}", response_model=Product)
async def admin_update_product(
    product_id: str,
    product_update: ProductCreate,
    username: str = Depends(verify_token)
):
    existing = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Product not found")
    
    updated_product = Product(id=product_id, **product_update.model_dump())
    await db.products.update_one(
        {"id": product_id},
        {"$set": updated_product.model_dump()}
    )
    return updated_product

@api_router.delete("/admin/products/{product_id}")
async def admin_delete_product(product_id: str, username: str = Depends(verify_token)):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

@api_router.get("/admin/stats")
async def admin_get_stats(username: str = Depends(verify_token)):
    pipeline = [
        {"$group": {"_id": "$category", "count": {"$sum": 1}}}
    ]
    stats = await db.products.aggregate(pipeline).to_list(100)
    total = await db.products.count_documents({})
    
    return {
        "total_products": total,
        "by_category": {item["_id"]: item["count"] for item in stats}
    }

@api_router.put("/admin/settings", response_model=Settings)
async def admin_update_settings(
    settings_update: SettingsUpdate,
    username: str = Depends(verify_token)
):
    settings = await db.settings.find_one({"id": "settings"}, {"_id": 0})
    if not settings:
        # Create if not exists
        new_settings = Settings(whatsapp_number=settings_update.whatsapp_number)
        await db.settings.insert_one(new_settings.model_dump())
        return new_settings
    
    # Update existing
    await db.settings.update_one(
        {"id": "settings"},
        {"$set": {"whatsapp_number": settings_update.whatsapp_number}}
    )
    
    updated = await db.settings.find_one({"id": "settings"}, {"_id": 0})
    return Settings(**updated)

@api_router.post("/admin/change-password")
async def admin_change_password(
    password_data: ChangePasswordRequest,
    username: str = Depends(verify_token)
):
    # Verify current password
    if not verify_password(password_data.current_password, ADMIN_PASSWORD_HASH):
        raise HTTPException(status_code=400, detail="Senha atual incorreta")
    
    # Hash new password
    new_hash = pwd_context.hash(password_data.new_password)
    
    # Update .env file
    env_path = ROOT_DIR / '.env'
    with open(env_path, 'r') as f:
        lines = f.readlines()
    
    with open(env_path, 'w') as f:
        for line in lines:
            if line.startswith('ADMIN_PASSWORD_HASH='):
                f.write(f'ADMIN_PASSWORD_HASH="{new_hash}"\n')
            else:
                f.write(line)
    
    return {"message": "Senha alterada com sucesso! Faça login novamente."}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()