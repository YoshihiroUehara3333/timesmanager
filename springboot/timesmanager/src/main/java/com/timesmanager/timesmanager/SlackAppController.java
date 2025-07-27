package com.timesmanager.timesmanager;

import jakarta.servlet.annotation.WebServlet;

import com.slack.api.bolt.App;
import com.slack.api.bolt.servlet.SlackAppServlet;

@WebServlet("/slack/events")
public class SlackAppController extends SlackAppServlet {
	public SlackAppController(App app) {
		super(app);
	}
}
