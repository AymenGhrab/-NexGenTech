public with sharing class BackInStockController {
 
    @AuraEnabled
    public static Boolean isProductOutOfStock(Id productId) {
        try {
            Product2 product = [
                SELECT Id, Quantity__c
                FROM Product2
                WHERE Id = :productId
                LIMIT 1
            ];
 
            if (product.Quantity__c == null) {
                throw new AuraHandledException('Stock quantity is missing for this product.');
            }
 
            return product.Quantity__c <= 0;
        } catch (Exception e) {
            throw new AuraHandledException('Error checking stock: ' + e.getMessage());
        }
    }
 
    @AuraEnabled
    public static Back_in_stock_alert__c createStockRequest(Id productId, String email, Id accountId) {
        try {
            if (String.isBlank(email) ||
                !Pattern.matches('^[\\w._%+-]+@[\\w.-]+\\.[a-zA-Z]{2,}$', email)) {
                throw new AuraHandledException('Invalid email format');
            }
 
            Back_in_stock_alert__c alert = new Back_in_stock_alert__c();
            alert.Name = 'BIS-' + System.now().format('yyyyMMddHHmmss');
            alert.Customer_Email__c = email;
            alert.Product__c = productId;
            alert.Request_Date__c = System.now();
            alert.Status__c = 'Requested';
            alert.CurrencyIsoCode = UserInfo.getDefaultCurrency();
 
            if (accountId != null) {
                alert.Account__c = accountId;
            }
 
            insert alert;
            return alert;
 
        } catch (Exception e) {
            throw new AuraHandledException('Error creating alert: ' + e.getMessage());
        }
    }
 
    @AuraEnabled(cacheable=true)
    public static Boolean isUserAuthenticated() {
        return UserInfo.getUserType() != 'Guest';
    }
 
    @AuraEnabled(cacheable=true)
    public static Map<String, String> getAuthenticatedUserDetails() {
        User currentUser = [
            SELECT Id, Email, AccountId
            FROM User
            WHERE Id = :UserInfo.getUserId()
            LIMIT 1
        ];
 
        Map<String, String> userDetails = new Map<String, String>();
        userDetails.put('email', currentUser.Email);
        userDetails.put('accountId', String.valueOf(currentUser.AccountId));
 
        return userDetails;
    }
 
    // ✅ NEW: Check if an active (non-expired) request exists
    @AuraEnabled(cacheable=true)
    public static Boolean hasActiveAlert(Id productId, String email) {
        if (String.isBlank(email)) return false;
 
        List<Back_in_stock_alert__c> alerts = [
            SELECT Id, Status__c
            FROM Back_in_stock_alert__c
            WHERE Product__c = :productId
            AND Customer_Email__c = :email
            AND Status__c != 'Expired'
            LIMIT 1
        ];
 
        return !alerts.isEmpty();
    }
}