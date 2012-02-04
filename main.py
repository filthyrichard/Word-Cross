#!/usr/bin/env python

import os
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util
from google.appengine.ext.webapp.template import render
from google.appengine.ext import db
from google.appengine.api import users
from django.utils import simplejson

class Score(db.Model):
	user = db.UserProperty()
	score = db.IntegerProperty()
	width = db.IntegerProperty()
	height = db.IntegerProperty()
	board = db.StringProperty()

class IndexHandler(webapp.RequestHandler):
	def get(self):
		tmpl = os.path.join(os.path.dirname(__file__), 'index.html')
		user = users.get_current_user()
		if user:
			context = {'user_message':("Signed in as %s (<a href=\"%s\">sign out</a>)" %
                        (user.nickname(), users.create_logout_url("/")))}
		else:
			context = {'user_message':("<a href=\"%s\">Sign in</a>" % users.create_login_url('/'))}
			
		self.response.out.write(render(tmpl, context))

class SubmitGameHandler(webapp.RequestHandler):
	def get(self):
		score = Score()
		score.score = int(self.request.get("score"))
		score.width = int(self.request.get("width"))
		score.height = int(self.request.get("height"))
		score.board = self.request.get("board")
		score.user = users.get_current_user()

		score.put()

class HighScoresHandler(webapp.RequestHandler):
	def get(self):
		query = Score.gql("ORDER BY score DESC LIMIT 10")
		scores = []
		for score in query:
			scoreObj = {'score' : score.score,
						  'width' : score.width, 
						  'height' : score.height, 
						  'board' : score.board,
						  'user' : "Anonymous" }

			if score.user != None:
				scoreObj['user'] = score.user.nickname()
			scores.append(scoreObj)
		self.response.out.write(simplejson.dumps(scores))

class DeleteScoresHandler(webapp.RequestHandler):
	def get(self):
		db.delete(Score.all())

def main():
	application = webapp.WSGIApplication([('/', IndexHandler),
										  ('/submitGame', SubmitGameHandler),
										  ('/getHighScores', HighScoresHandler),
										  ('/deleteScores', DeleteScoresHandler)],
										 debug = True)
	util.run_wsgi_app(application)

if __name__ == '__main__':
	main()
