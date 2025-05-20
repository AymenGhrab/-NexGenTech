public with sharing class ProductAvailabilityController {
    @AuraEnabled(cacheable=true)
    public static Boolean isProductOutOfStock(Id productId) {
        System.debug('🔍 Checking product availability for ID: ' + productId);

        try {
            Product2 product = [
                SELECT Id, Name, Available__c 
                FROM Product2 
                WHERE Id = :productId 
                LIMIT 1
            ];

            System.debug('Product fetched: ' + product.Name);
            System.debug('Available__c value: ' + product.Available__c);

            String availableText = product.Available__c != null ? product.Available__c.trim() : 'False';
            Boolean isOutOfStock = availableText == 'True' ? false : true;

            System.debug('isOutOfStock calculated as: ' + isOutOfStock);
            return isOutOfStock;

        } catch (Exception e) {
            System.debug('Error occurred in isProductOutOfStock: ' + e.getMessage());
            throw new AuraHandledException('Could not check product availability.');
        }
    }
}
