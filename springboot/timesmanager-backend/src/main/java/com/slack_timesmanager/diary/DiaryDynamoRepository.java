package com.slack_timesmanager.diary;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

@Repository
public class DiaryDynamoRepository {
	private final String PARTITION_KEY_BASE = "";
	
	public DiaryDynamoRepository() {
		super();
	}
	
	public ResponseEntity<Void> updateItem(DiaryRequest request) {
		try {
		}
		catch(Exception e) {
			return ResponseEntity.internalServerError().build();
		}
		
		return ResponseEntity.ok().build();
	}
    // dateからSortKeyを生成し、Diaryを1件取得する
    public DiaryResponse getDiaryByUserId (String userId) {
        String partitionKey = userId + PARTITION_KEY_BASE;
        String sortKey = "";
        try {
        } 
        catch (Exception e) {
        }
        return new DiaryResponse();
    }
    
    // dateからSortKeyを生成し、Diaryを1件取得する
    public DiaryResponse getDiaryByDate (String userId, String date) {
        String partitionKey = userId + PARTITION_KEY_BASE;
        String sortKey = date;
        try {
        } 
        catch (Exception e) {
        }
        return new DiaryResponse();
    }
}
