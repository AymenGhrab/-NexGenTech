public with sharing class NewsletterController {
    
    // Wrapper to return authenticated user info
    public class UserWrapper {
        @AuraEnabled public String email;
        @AuraEnabled public String name;

        public UserWrapper(String email, String name) {
            this.email = email;
            this.name = name;
        }
    }

    // Check if the user is authenticated (not a guest)
    @AuraEnabled(cacheable=true)
    public static Boolean isUserAuthenticated() {
        return UserInfo.getUserType() != 'Guest';
    }

    // Return basic info about authenticated user
    @AuraEnabled(cacheable=true)
    public static UserWrapper getAuthenticatedUserDetails() {
        User u = [SELECT Email, Name FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];
        return new UserWrapper(u.Email, u.Name);
    }

    // Check if the given email is already subscribed
    @AuraEnabled(cacheable=true)
    public static Boolean isEmailSubscribed(String email) {
        List<Newsletter__c> subs = [SELECT Id FROM Newsletter__c WHERE Email__c = :email LIMIT 1];
        return !subs.isEmpty();
    }

    // Subscribe email to the newsletter if not already subscribed
    @AuraEnabled
    public static String subscribeToNewsletter(String email, String type, String name) {
        if (isEmailSubscribed(email)) {
            return 'alreadySubscribed';
        }

        Newsletter__c newSubscriber = new Newsletter__c(
            Email__c = email,
            Type__c = type,
            Name = name
        );

        insert newSubscriber;
        return 'success';
    }
}
