trigger ProductRatingTrigger on ProductRating__c (after insert) {
    if (Trigger.isAfter && Trigger.isInsert) {
        UpdateProductRating.updateProductRatings(Trigger.new);
    }
}
