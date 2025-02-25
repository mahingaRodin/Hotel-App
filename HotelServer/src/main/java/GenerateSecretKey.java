import java.util.Base64;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.SignatureAlgorithm;

public class GenerateSecretKey {
    public static void main(String[] args) {
        String encodedKey = Base64.getEncoder().encodeToString(
                Keys.secretKeyFor(SignatureAlgorithm.HS256).getEncoded()
        );
        System.out.println("Base64 Secret Key: " + encodedKey);
    }
}
