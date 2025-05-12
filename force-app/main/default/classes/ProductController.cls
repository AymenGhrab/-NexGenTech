@RestResource(urlMapping='/products')
global with sharing class ProductController {  
    @HttpGet
    @AuraEnabled(cacheable=true) 
    global static List<Product2> getProducts() {
        return [SELECT Id, Name, Description, Price__c, Image__c FROM Product2];
    }

    @AuraEnabled(cacheable=true)
    public static List<Product2> getProductsByCategory(String categoryPath) {
        // Find the category based on its name
        List<ProductCategory> categories = [SELECT Id FROM ProductCategory WHERE Name = :categoryPath LIMIT 1];

        if (categories.isEmpty()) {
            return new List<Product2>(); // Return an empty list if no category is found
        }

        Id categoryId = categories[0].Id;

        // Get products related to this category
        return [
            SELECT Id, Name, Description, Price__c, Image__c 
            FROM Product2 
            WHERE Id IN (
                SELECT ProductId FROM ProductCategoryProduct WHERE ProductCategoryId = :categoryId
            )
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Product2> getProductsByCategory2(Id recordId) {
        if (recordId == null) {
            return new List<Product2>(); // Return an empty list if no category ID is provided
        }
    
        return [
            SELECT Id, Name, Description, Price__c, Image__c 
            FROM Product2 
            WHERE Id IN (
                SELECT ProductId FROM ProductCategoryProduct WHERE ProductCategoryId = :recordId
            )
        ];
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Product2> getProductsByCategory3(String categoryId) {
        return [SELECT Id, Name, Description, Price__c, Image__c
                FROM Product2
                WHERE Id IN (SELECT ProductId FROM ProductCategoryProduct WHERE ProductCategoryId = :categoryId)];
    }
    

    @AuraEnabled(cacheable=true)
    public static Product2 getProductDetails(String productId) {
        return [SELECT Id, Name, Description, Image__c, Price__c
                FROM Product2 
                WHERE Id = :productId LIMIT 1];
    }

    @AuraEnabled(cacheable=true)
    public static List<ProductRating__c> getReviewsForProduct(Id productId) {
        return [
            SELECT Id, Name, ProductRating__c, Product__c, CreatedDate
            FROM ProductRating__c
            WHERE Product__c = :productId
            ORDER BY CreatedDate DESC
        ];
    }

    @AuraEnabled
    public static ProductRating__c submitReview(Id productId, String title, Decimal rating) {
        ProductRating__c review = new ProductRating__c();
        review.Name = title;
        review.ProductRating__c = rating;
        review.Product__c = productId;
        
        try {
            insert review;
        } catch (DmlException e) {
            throw new AuraHandledException('Failed to submit review: ' + e.getMessage());
        }

        return review;
    }
}
