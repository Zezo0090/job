#!/usr/bin/env python3
import requests
import sys
import json
from datetime import datetime

class JobniAPITester:
    def __init__(self, base_url="https://jobspot-elite.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tokens = {}
        self.users = {}
        self.jobs = {}
        self.applications = {}
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, user_type=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if user_type and user_type in self.tokens:
            test_headers['Authorization'] = f'Bearer {self.tokens[user_type]}'
        elif headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json() if response.content else {}
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'name': name,
                'error': str(e)
            })
            return False, {}

    def test_auth_flow(self):
        """Test authentication for all user types"""
        print("\n=== Testing Authentication ===")
        
        # Test login for predefined users
        test_users = [
            {"email": "admin@jobni.com", "password": "Admin123!", "type": "admin"},
            {"email": "company@jobni.com", "password": "Company123!", "type": "employer"},
            {"email": "employee@jobni.com", "password": "Employee123!", "type": "job_seeker"}
        ]
        
        for user_data in test_users:
            success, response = self.run_test(
                f"Login {user_data['type']}",
                "POST",
                "auth/login",
                200,
                data={"email": user_data["email"], "password": user_data["password"]}
            )
            
            if success and 'access_token' in response:
                self.tokens[user_data['type']] = response['access_token']
                self.users[user_data['type']] = response['user']
                print(f"   Token stored for {user_data['type']}")
            else:
                print(f"   ❌ Failed to get token for {user_data['type']}")

        # Test /auth/me for each user
        for user_type in self.tokens:
            self.run_test(
                f"Get current user ({user_type})",
                "GET",
                "auth/me",
                200,
                user_type=user_type
            )

    def test_jobs_flow(self):
        """Test job-related endpoints"""
        print("\n=== Testing Jobs ===")
        
        # Test get all jobs (public)
        success, jobs_data = self.run_test(
            "Get all jobs",
            "GET",
            "jobs",
            200
        )
        
        if success and jobs_data:
            print(f"   Found {len(jobs_data)} jobs")
            if jobs_data:
                self.jobs['sample'] = jobs_data[0]
                
                # Test get specific job
                job_id = jobs_data[0]['id']
                self.run_test(
                    f"Get job details",
                    "GET",
                    f"jobs/{job_id}",
                    200
                )

        # Test job creation (employer)
        if 'employer' in self.tokens:
            job_data = {
                "title": "Test Job",
                "description": "This is a test job posting",
                "company_name": "Test Company",
                "location": "الرياض",
                "duration_type": "hours_8",
                "duration_value": "8 ساعات",
                "salary": 200.0,
                "category": "التقنية",
                "requirements": ["خبرة في البرمجة", "إتقان اللغة الإنجليزية"]
            }
            
            success, job_response = self.run_test(
                "Create job (employer)",
                "POST",
                "jobs",
                200,
                data=job_data,
                user_type='employer'
            )
            
            if success and 'id' in job_response:
                self.jobs['created'] = job_response
                print(f"   Created job with ID: {job_response['id']}")

        # Test job search with filters
        self.run_test(
            "Search jobs by category",
            "GET",
            "jobs?category=التقنية",
            200
        )

    def test_applications_flow(self):
        """Test application-related endpoints"""
        print("\n=== Testing Applications ===")
        
        if 'job_seeker' in self.tokens and 'sample' in self.jobs:
            job_id = self.jobs['sample']['id']
            
            # Test job application
            success, app_response = self.run_test(
                "Apply to job (job_seeker)",
                "POST",
                "applications",
                200,
                data={
                    "job_id": job_id,
                    "message": "أنا مهتم بهذه الوظيفة"
                },
                user_type='job_seeker'
            )
            
            if success and 'id' in app_response:
                self.applications['created'] = app_response
                print(f"   Created application with ID: {app_response['id']}")

        # Test get applications for each user type
        for user_type in ['job_seeker', 'employer', 'admin']:
            if user_type in self.tokens:
                self.run_test(
                    f"Get applications ({user_type})",
                    "GET",
                    "applications",
                    200,
                    user_type=user_type
                )

        # Test application status update (employer)
        if 'employer' in self.tokens and 'created' in self.applications:
            app_id = self.applications['created']['id']
            self.run_test(
                "Update application status (employer)",
                "PUT",
                f"applications/{app_id}",
                200,
                data={"status": "accepted"},
                user_type='employer'
            )

    def test_saved_jobs_flow(self):
        """Test saved jobs functionality"""
        print("\n=== Testing Saved Jobs ===")
        
        if 'job_seeker' in self.tokens and 'sample' in self.jobs:
            job_id = self.jobs['sample']['id']
            
            # Test save job
            self.run_test(
                "Save job",
                "POST",
                f"saved-jobs/{job_id}",
                200,
                user_type='job_seeker'
            )
            
            # Test get saved jobs
            self.run_test(
                "Get saved jobs",
                "GET",
                "saved-jobs",
                200,
                user_type='job_seeker'
            )
            
            # Test unsave job
            self.run_test(
                "Unsave job",
                "DELETE",
                f"saved-jobs/{job_id}",
                200,
                user_type='job_seeker'
            )

    def test_notifications_flow(self):
        """Test notifications functionality"""
        print("\n=== Testing Notifications ===")
        
        for user_type in ['job_seeker', 'employer', 'admin']:
            if user_type in self.tokens:
                self.run_test(
                    f"Get notifications ({user_type})",
                    "GET",
                    "notifications",
                    200,
                    user_type=user_type
                )

    def test_admin_endpoints(self):
        """Test admin-only endpoints"""
        print("\n=== Testing Admin Endpoints ===")
        
        if 'admin' in self.tokens:
            # Test admin stats
            self.run_test(
                "Get admin stats",
                "GET",
                "admin/stats",
                200,
                user_type='admin'
            )
            
            # Test get all users
            self.run_test(
                "Get all users (admin)",
                "GET",
                "admin/users",
                200,
                user_type='admin'
            )

    def test_reports_flow(self):
        """Test reports and invoice generation"""
        print("\n=== Testing Reports ===")
        
        # Test user stats for different user types
        for user_type in ['job_seeker', 'employer']:
            if user_type in self.tokens:
                self.run_test(
                    f"Get user stats ({user_type})",
                    "GET",
                    "reports/stats",
                    200,
                    user_type=user_type
                )

        # Test invoice generation (if we have an accepted application)
        if 'created' in self.applications:
            app_id = self.applications['created']['id']
            # Note: This might fail if application is not accepted
            success, _ = self.run_test(
                "Generate invoice",
                "GET",
                f"reports/invoice/{app_id}",
                200,
                user_type='employer'
            )
            if not success:
                print("   Note: Invoice generation failed - application might not be accepted")

    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting Jobni API Tests...")
        print(f"Testing against: {self.base_url}")
        
        try:
            self.test_auth_flow()
            self.test_jobs_flow()
            self.test_applications_flow()
            self.test_saved_jobs_flow()
            self.test_notifications_flow()
            self.test_admin_endpoints()
            self.test_reports_flow()
            
        except Exception as e:
            print(f"\n❌ Test suite failed with error: {str(e)}")
            return False

        # Print results
        print(f"\n📊 Test Results:")
        print(f"   Tests run: {self.tests_run}")
        print(f"   Tests passed: {self.tests_passed}")
        print(f"   Tests failed: {self.tests_run - self.tests_passed}")
        print(f"   Success rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ Failed Tests:")
            for test in self.failed_tests:
                print(f"   - {test['name']}: {test.get('error', f'Expected {test.get(\"expected\")}, got {test.get(\"actual\")}')}")
        
        return self.tests_passed == self.tests_run

def main():
    tester = JobniAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())