import requests
import sys
from datetime import datetime

class HamburgueriaAPITester:
    def __init__(self, base_url="https://smooth-food-order.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.admin_token = None

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None, auth_required=False):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        # Add authorization header if required
        if auth_required and self.admin_token:
            headers['Authorization'] = f'Bearer {self.admin_token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        print(f"   Response: {len(response_data)} items returned")
                    elif isinstance(response_data, dict):
                        print(f"   Response keys: {list(response_data.keys())}")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")

            return success, response.json() if success and response.text else {}

        except Exception as e:
            self.failed_tests.append({
                'name': name,
                'error': str(e)
            })
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test(
            "Root API Endpoint",
            "GET",
            "",
            200
        )

    def test_seed_products(self):
        """Test seeding products"""
        return self.run_test(
            "Seed Products",
            "POST",
            "seed-products",
            200
        )

    def test_get_all_products(self):
        """Test getting all products"""
        return self.run_test(
            "Get All Products",
            "GET",
            "products",
            200
        )

    def test_get_products_by_category(self):
        """Test filtering products by category"""
        categories = ['hamburgueres', 'acompanhamentos', 'bebidas', 'sobremesas']
        results = []
        
        for category in categories:
            success, response = self.run_test(
                f"Get Products - Category: {category}",
                "GET",
                "products",
                200,
                params={'category': category}
            )
            results.append((category, success, response))
            
        return results

    def test_create_product(self):
        """Test creating a new product"""
        test_product = {
            "name": "Test Burger",
            "description": "Test burger for API testing",
            "price": 25.90,
            "category": "hamburgueres",
            "image_url": "https://example.com/test-burger.jpg"
        }
        
        return self.run_test(
            "Create Product",
            "POST",
            "products",
            200,
            data=test_product
        )

    def test_create_order(self):
        """Test creating an order"""
        test_order = {
            "items": [
                {
                    "product_id": "test-id-123",
                    "name": "Test Burger",
                    "price": 25.90,
                    "quantity": 2
                }
            ],
            "address": "Rua Teste, 123 - Centro",
            "observations": "Sem cebola",
            "delivery_fee": 8.00,
            "total": 59.80
        }
        
        return self.run_test(
            "Create Order",
            "POST",
            "orders",
            200,
            data=test_order
        )

    # Admin Authentication Tests
    def test_admin_login_valid(self):
        """Test admin login with valid credentials"""
        login_data = {
            "username": "admin",
            "password": "admin123"
        }
        
        success, response = self.run_test(
            "Admin Login - Valid Credentials",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success and 'access_token' in response:
            self.admin_token = response['access_token']
            print(f"   ✅ Token obtained successfully")
            return True
        return False

    def test_admin_login_invalid(self):
        """Test admin login with invalid credentials"""
        login_data = {
            "username": "admin",
            "password": "wrongpassword"
        }
        
        return self.run_test(
            "Admin Login - Invalid Credentials",
            "POST",
            "auth/login",
            401,
            data=login_data
        )

    # Admin Protected Routes Tests
    def test_admin_get_products(self):
        """Test getting products via admin endpoint"""
        return self.run_test(
            "Admin Get Products",
            "GET",
            "admin/products",
            200,
            auth_required=True
        )

    def test_admin_get_stats(self):
        """Test getting admin statistics"""
        return self.run_test(
            "Admin Get Statistics",
            "GET",
            "admin/stats",
            200,
            auth_required=True
        )

    def test_admin_create_product(self):
        """Test creating a product via admin endpoint"""
        test_product = {
            "name": "Admin Test Burger",
            "description": "Test burger created via admin API",
            "price": 29.90,
            "category": "hamburgueres",
            "image_url": "https://example.com/admin-test-burger.jpg"
        }
        
        success, response = self.run_test(
            "Admin Create Product",
            "POST",
            "admin/products",
            200,
            data=test_product,
            auth_required=True
        )
        
        # Store product ID for update/delete tests
        if success and 'id' in response:
            self.test_product_id = response['id']
            print(f"   ✅ Product created with ID: {self.test_product_id}")
        
        return success, response

    def test_admin_update_product(self):
        """Test updating a product via admin endpoint"""
        if not hasattr(self, 'test_product_id'):
            print("   ⚠️  Skipping update test - no product ID available")
            return False, {}
            
        updated_product = {
            "name": "Updated Admin Test Burger",
            "description": "Updated test burger description",
            "price": 32.90,
            "category": "hamburgueres",
            "image_url": "https://example.com/updated-admin-test-burger.jpg"
        }
        
        return self.run_test(
            "Admin Update Product",
            "PUT",
            f"admin/products/{self.test_product_id}",
            200,
            data=updated_product,
            auth_required=True
        )

    def test_admin_delete_product(self):
        """Test deleting a product via admin endpoint"""
        if not hasattr(self, 'test_product_id'):
            print("   ⚠️  Skipping delete test - no product ID available")
            return False, {}
            
        return self.run_test(
            "Admin Delete Product",
            "DELETE",
            f"admin/products/{self.test_product_id}",
            200,
            auth_required=True
        )

    def test_admin_unauthorized_access(self):
        """Test accessing admin endpoints without token"""
        return self.run_test(
            "Admin Unauthorized Access",
            "GET",
            "admin/products",
            401
        )

def main():
    print("🍔 Starting Ricardo ZapDelivery API Tests...")
    print("=" * 50)
    
    # Setup
    tester = HamburgueriaAPITester()
    
    # Test root endpoint
    tester.test_root_endpoint()
    
    # Test seeding products
    tester.test_seed_products()
    
    # Test getting all products
    tester.test_get_all_products()
    
    # Test category filtering
    category_results = tester.test_get_products_by_category()
    
    # Test creating a product
    tester.test_create_product()
    
    # Test creating an order
    tester.test_create_order()
    
    print("\n" + "=" * 50)
    print("🔐 ADMIN AUTHENTICATION TESTS")
    print("=" * 50)
    
    # Test admin login with invalid credentials first
    tester.test_admin_login_invalid()
    
    # Test admin login with valid credentials
    login_success = tester.test_admin_login_valid()
    
    if login_success:
        print("\n" + "=" * 50)
        print("👑 ADMIN PROTECTED ROUTES TESTS")
        print("=" * 50)
        
        # Test unauthorized access (without token)
        temp_token = tester.admin_token
        tester.admin_token = None
        tester.test_admin_unauthorized_access()
        tester.admin_token = temp_token
        
        # Test admin endpoints with valid token
        tester.test_admin_get_products()
        tester.test_admin_get_stats()
        
        # Test admin CRUD operations
        create_success, _ = tester.test_admin_create_product()
        if create_success:
            tester.test_admin_update_product()
            tester.test_admin_delete_product()
    else:
        print("❌ Admin login failed - skipping protected route tests")
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 FINAL RESULTS")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.failed_tests:
        print(f"\n❌ FAILED TESTS:")
        for i, failure in enumerate(tester.failed_tests, 1):
            print(f"{i}. {failure['name']}")
            if 'error' in failure:
                print(f"   Error: {failure['error']}")
            else:
                print(f"   Expected: {failure['expected']}, Got: {failure['actual']}")
                print(f"   Response: {failure['response']}")
    
    # Analyze category filtering results
    print(f"\n📋 CATEGORY FILTERING ANALYSIS:")
    for category, success, response in category_results:
        if success and isinstance(response, list):
            print(f"✅ {category}: {len(response)} products")
        else:
            print(f"❌ {category}: Failed")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())