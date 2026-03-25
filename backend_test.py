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

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

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