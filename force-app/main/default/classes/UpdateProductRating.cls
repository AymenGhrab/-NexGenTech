public class UpdateProductRating {
    public static void updateProductRatings(List<ProductRating__c> newList) {
        List<ProductRating__c> toUpdate = new List<ProductRating__c>();

        for (ProductRating__c r : newList) {
            if (r.Id != null) {
              
                ProductRating__c clone = new ProductRating__c(
                    Id = r.Id
               
                );
                toUpdate.add(clone);
            }
        }

        if (!toUpdate.isEmpty()) {
            update toUpdate;
        }
    }
}