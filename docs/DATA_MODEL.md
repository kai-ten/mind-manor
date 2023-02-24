Data format

Vertex: `~id, ~label`
<br />
Edge: `~id, ~from, ~to, ~label, weight:double`

(tilde)id, title:String, url:String, description:String, author_admins:String[], contributors:String[], published_date:Date, last_modified_date:Date, revision:Int, latest_version:Int, ~label

Vertices:


Endpoint - gremlin query that checks whether a vertex has another edge or not, then identities endpoints of a mind map


- map

  - title:String
  - description:String
  - author_admins:String[]              # This will show all people approved to make changes. Able to view by default
  - contributors:String[]
  - published_date:Date
  - last_modified_date:Date
  - isPublic:Boolean                    # This will turn on public viewing

  - revision:Int # future state

- section
  - ~id
  - title:String
  - url:String
  - description:String

- tag                                   # created by user, value is unique, ultimately can further process down to tag searching capabilities
  - value



### Datetime example

https://stackoverflow.com/questions/53147594/aws-neptune-datetime

### Labels to treat the data in different ways

https://docs.aws.amazon.com/neptune/latest/userguide/access-graph-gremlin-differences.html#w3aac18c16c10c15c59
