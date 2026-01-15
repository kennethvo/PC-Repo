package com.example.eureka_clientb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.client.RestClient;
import org.springframework.context.annotation.Bean;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.client.ServiceInstance;


@SpringBootApplication
public class EurekaClientbApplication {

	public static void main(String[] args) {
		SpringApplication.run(EurekaClientbApplication.class, args);
	}

	@Bean
	public RestClient restClient(){
		return RestClient.create();
	}
}

@RestController
class ServiveBController{
	// Fields
	private final RestClient restClient;
	private final DiscoveryClient discoveryClient;

	// Cponstructor
	public ServiveBController(RestClient restClient, DiscoveryClient discoveryClient){
		this.restClient = restClient;
		this.discoveryClient = discoveryClient;
	}

	// Methods

	@GetMapping("/hello")
	public String hello(){
		return "hello from Client B";
	}

	@GetMapping("/helloa")
	public String helloa(){
		// Find out where Client A is...
		ServiceInstance instance = discoveryClient.getInstances("eureka-clienta").get(0);

		//Place the request to Client A...
		String response = restClient.get()
			.uri(instance.getUri() + "/hello")
			.retrieve()
			.body(String.class);

		return response;
	}
}