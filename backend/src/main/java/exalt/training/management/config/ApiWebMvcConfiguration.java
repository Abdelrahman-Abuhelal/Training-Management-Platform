package exalt.training.management.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.ByteArrayHttpMessageConverter;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.DelegatingWebMvcConfiguration;

import java.util.List;

@Configuration
public class ApiWebMvcConfiguration extends DelegatingWebMvcConfiguration {

    @Autowired
    Jackson2ObjectMapperBuilder jacksonBuilder;

    @Override
    protected void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        var applicationContext = this.getApplicationContext();
        if (applicationContext != null) {
            jacksonBuilder.applicationContext(applicationContext);
        }
        converters.add(new ByteArrayHttpMessageConverter());
        converters.add(new MappingJackson2HttpMessageConverter(jacksonBuilder.build()));
    }
}