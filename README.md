## justification of tools
#### sequelize vs knex.
I was on the fence about using sequelize vs knex. I'm generally much more comfortable with a lighterweight query builder than a full orm, I decided to go with sequelize because there was mention in conversation that it worked nicely with graphql, and I don't want to appear to be married to knex or only able to use a single tool. However, I have strong opinions about things in my database and i found myself fighting with sequelize to enforce them. 
opinions:
	- database schema definition should not have capital letters, ever, because (most, at least all that I've worked with) databases ignore case for their schema definitions. This project is built on postgres, which considers the following queries to be identical: `SELECT userid FROM points` == `SELECT userID FROM points`. To this end, no table or column should have camel case names.
	- database tables should be singular. This is a little more contentious than my previous point, but the main line of reasoning comes down to having to keeping foreign keys constent with their table names. It is much easier to programatically work out joins, for example, when you can join `points` to `user` on `user.id = point.user_id`, than it is to join on `users.id = point.user_id`. This example is trivally worked out, but it becomes more of a headache when the plural version of the word is different. Consider an `items` table joinging to `deleveries` on `deliveries.id = items.delivery_id`. I admit, I am not often writing code to generate joins, but this also minimizes developer overhead when writing manual queries, which is something I'm often doing when prototyping and experimenting.

These things are totally doable with sequelize, I just find that I'm working  against a lot of the selling points when I'm insisting on enforcing these opinions (selling point being that you don't have to think about this stuff haha).

I also want to note that I'm not an absolutist when it comes to these points. I would like to talk about them and weigh the pros and cons of each approach, but am usually the most happy to keep things consistent within a single code base or organization, rather than mucking everything up with whatever the flavor of the week is.

## todo
* talk about uuid, idempotent implications
* figure out logging
* dockerize the project
