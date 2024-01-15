package exalt.training.management.exception;

public class AppUserNotFoundException extends RuntimeException {

    public AppUserNotFoundException(String message){
        super(message);
    }
}
