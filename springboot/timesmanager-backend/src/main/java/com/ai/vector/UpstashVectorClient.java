package com.ai.vector;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.ai.vector.dto.SearchRequest;
import com.ai.vector.dto.SearchResponse;
import com.ai.vector.dto.UpsertRequest;

@Component
public class UpstashVectorClient {

	private final RestClient restClient;

	public UpstashVectorClient(
			@Value("${upstash.vector.url}") String url,
			@Value("${upstash.vector.token}") String token) {

		this.restClient = RestClient.builder()
				.baseUrl(url)
				.defaultHeader(HttpHeaders.AUTHORIZATION,
						"Bearer " + token)
				.build();
	}

	public void upsert(UpsertRequest request) {

		restClient.post()
				.uri("/upsert-data")
				.body(request)
				.retrieve()
				.toBodilessEntity();
	}

	public SearchResponse search(SearchRequest request) {

		return restClient.post()
				.uri("/query-data")
				.body(request)
				.retrieve()
				.body(SearchResponse.class);
	}
}