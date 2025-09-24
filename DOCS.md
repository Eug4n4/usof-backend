# Documentation

Here you can find information about steps completed during the developing process. Besides, there is also a description of the algorithm of the whole program.

## Engage

During this stage, the big idea of the project was identified - knowledge and experience exchange. Then, questions neccessary to complete the challenge were gathered (For example: Why people share knowledge and experience? What is more useful - knowledge sharing website or official documentation?)

Finally, it was decided to create a service (API as the first part of the project) for professional and enthusiast programmers in order to help them exchange knowledge. So, programmers were chosen as the main audience.

## Investigate

During this stage, answers to the gathered questions were found.

Q: Why people share knowledge and experience? A: want to gain recognition among others; they want to challenge yourself to explain difficult things using easy language. If they succeed - they really have deep knowledge about this technology.

Q: What is more useful - knowledge sharing website or official documentation? A: knowledge sharing website is more useful, because documentation might not always cover all use cases. On the website you usually can get the answer devoted to your specific question faster.

After that, a list of the minimum number of features that need to be implemented was created. Such features include: registration, authentication and authorization. Role-based access and ability to create, read, update and delete posts, comments, categories and reactions.

Then, information about technology stack that is used to create web services was found. Such technologies like JS, Node.js, Express and MySQL were chosen.

## Act

During this stage, the main parts of the API were implemented:

- Created neccessary tables in order to manipulate data.  
- Built endpoints for posts, comments, categories, and likes/dislikes.  
- Implemented JWT-based login, refresh tokens, and role-based access (admin, user).  
- Used `express-validator` to check query parameters and request body.  
- Added ability to upload avatars.  

## Program's algorithm

In short, user sends an http request to the server, server's router matches the request with an appropriate handler. There are validators and role restrictions to prevent accessing handler code using bad payload or inappropriate role. In case of role restrictions, there is a check for token existance. If there is no token in user's cookie, then user has no access to this route, otherwise if the role is suitable, then a response with status 20x is returned, else a response with status 40x is returned.
