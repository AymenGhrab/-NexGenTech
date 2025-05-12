/**
 * This class contains unit tests for validating the behavior of Apex classes
 * and triggers.
 *
 * Unit tests are class methods that verify whether a particular piece
 * of code is working properly. Unit test methods take no arguments,
 * commit no data to the database, and are flagged with the testMethod
 * keyword in the method definition.
 *
 * All test methods in an org are executed whenever Apex code is deployed
 * to a production org to confirm correctness, ensure code
 * coverage, and prevent regressions. All Apex classes are
 * required to have at least 75% code coverage in order to be deployed
 * to a production org. In addition, all triggers must have some code coverage.
 * 
 * The @isTest class annotation indicates this class only contains test
 * methods. Classes defined with the @isTest annotation do not count against
 * the org size limit for all Apex scripts.
 *
 * See the Apex Language Reference for more information about Testing and Code Coverage.
 */
@isTest
public class BackInStockControllerTest {

    @testSetup
    static void setupData() {
        // Create a sample Product2 record
        Product2 inStockProduct = new Product2(
            Name = 'In Stock Product',
            Available__c = 'True',
            IsActive = true ,
            Price__c = 10.00
        );
        insert inStockProduct;

        Product2 outOfStockProduct = new Product2(
            Name = 'Out of Stock Product',
            Available__c = 'False',
            IsActive = true ,
            Price__c = 10.00
        );
        insert outOfStockProduct;
    }

    @isTest
    static void testIsProductOutOfStock_True() {
        // Get the out-of-stock product
        Product2 p = [SELECT Id FROM Product2 WHERE Available__c = 'False' LIMIT 1];
        
        Test.startTest();
        Boolean result = BackInStockController.isProductOutOfStock(p.Id);
        Test.stopTest();
        
        System.assertEquals(true, result, 'Expected product to be out of stock');
    }

    @isTest
    static void testIsProductOutOfStock_False() {
        // Get the in-stock product
        Product2 p = [SELECT Id FROM Product2 WHERE Available__c = 'True' LIMIT 1];
        
        Test.startTest();
        Boolean result = BackInStockController.isProductOutOfStock(p.Id);
        Test.stopTest();
        
        System.assertEquals(false, result, 'Expected product to be in stock');
    }

    @isTest
    static void testCreateStockRequest_Success() {
        Product2 p = [SELECT Id FROM Product2 LIMIT 1];
        String email = 'test@example.com';

        Test.startTest();
        Back_in_stock_alert__c alert = BackInStockController.createStockRequest(p.Id, email);
        Test.stopTest();

        System.assertNotEquals(null, alert.Id, 'Alert record should be created');
        System.assertEquals(email, alert.Customer_Email__c, 'Email should match');
        System.assertEquals(p.Id, alert.Product__c, 'Product ID should match');
    }

    @isTest
    static void testCreateStockRequest_InvalidEmail() {
        Product2 p = [SELECT Id FROM Product2 LIMIT 1];
        String invalidEmail = 'invalid-email';

        Test.startTest();
        try {
            BackInStockController.createStockRequest(p.Id, invalidEmail);
            System.assert(false, 'Expected exception for invalid email');
        } catch (AuraHandledException e) {
            System.assert(e.getMessage().contains('Invalid email format'));
        }
        Test.stopTest();
    }

    @isTest
    static void testIsUserAuthenticated() {
        Test.startTest();
        Boolean isAuthenticated = BackInStockController.isUserAuthenticated();
        Test.stopTest();

        // Since test runs as an authenticated user, this should be true
        System.assertEquals(true, isAuthenticated, 'Test context user should not be Guest');
    }
}
