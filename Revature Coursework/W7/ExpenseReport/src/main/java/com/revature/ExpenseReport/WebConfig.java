package com.revature.ExpenseReport;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    // Fields
    //private final BasicAuthInterceptor basicAuthInterceptor;
    private final JwtInterceptor jwtInterceptor;
    
    // Constructor
    // public WebConfig(BasicAuthInterceptor bai) {
    //     this.basicAuthInterceptor = bai;
    // }
        public WebConfig(JwtInterceptor jwti) {
        this.jwtInterceptor = jwti;
    }

    // Method
    // @Override
    // public void addInterceptors(InterceptorRegistry reg) {
    //     // adding interceptors to the list of active/running interceptors
    //     // that are scanning requests as they come in
    //     reg.addInterceptor(basicAuthInterceptor)
    //             .addPathPatterns("/api/**")
    //             .excludePathPatterns("/api/hello");
    // }
    @Override
    public void addInterceptors(InterceptorRegistry reg) {
        // adding interceptors to the list of active/running interceptors
        // that are scanning requests as they come in
        reg.addInterceptor(jwtInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns("/api/hello", "/api/auth/login");
    }
}
