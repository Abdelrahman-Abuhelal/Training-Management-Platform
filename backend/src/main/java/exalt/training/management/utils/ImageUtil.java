package exalt.training.management.utils;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.zip.Deflater;

public class ImageUtil {

    public byte[] compressImage(byte[] imageData) throws Exception {
        BufferedImage bufferedImage = ImageIO.read(new ByteArrayInputStream(imageData));

        // Create a ByteArrayOutputStream to hold the compressed image data
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        // Compress the image to JPEG format with a specific quality (adjust as needed)
        ImageIO.write(bufferedImage, "jpeg", outputStream);

        return outputStream.toByteArray();
    }
}