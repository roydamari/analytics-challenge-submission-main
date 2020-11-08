import {OneDay,OneHour,OneWeek} from '../timeFrames'
const yesterday = new Date(new Date().toDateString()).getTime() - 7200001;
const today = new Date (new Date().toDateString()).getTime()+6*OneHour
const dayZero = today-5*OneWeek


const mockData: any = {
  "events": [
    {
      "_id": "Pnq5MmIZ6Z_",
      "session_id": "ebd9da74-3965-43c8-932f-a47b6bffd380",
      "name": "signup",
      "distinct_user_id": "aaa",
      "date": dayZero +1,
      "os": "windows",
      "browser": "firefox",
      "geolocation": {
        "location": {
          "lat": 20,
          "lng": 108
        },
        "accuracy": 868
      },
      "url": "http://localhost3000/signup"
    },
    {
      "_id": "Pnq5MmIZ6Z_",
      "session_id": "ebd9da74-3965-43c8-932f-a47b6bffd380",
      "name": "signup",
      "distinct_user_id": "ccc",
      "date": dayZero + OneWeek,
      "os": "windows",
      "browser": "firefox",
      "geolocation": {
        "location": {
          "lat": 20,
          "lng": 108
        },
        "accuracy": 868
      },
      "url": "http://localhost3000/signup"
    },
    {
      "_id": "Pnq5MmIZ6Z_",
      "session_id": "ebd9da74-3965-43c8-932f-a47b6bffd380",
      "name": "login",
      "distinct_user_id": "aaa",
      "date": dayZero + OneWeek,
      "os": "windows",
      "browser": "firefox",
      "geolocation": {
        "location": {
          "lat": 20,
          "lng": 108
        },
        "accuracy": 868
      },
      "url": "http://localhost3000/login"
    },
    {
      "_id": "Pnq5MmIZ6Z_",
      "session_id": "ebd9da74-3965-43c8-932f-a47b6bffd380",
      "name": "login",
      "distinct_user_id": "ccc",
      "date": dayZero + 2*OneWeek,
      "os": "windows",
      "browser": "firefox",
      "geolocation": {
        "location": {
          "lat": 20,
          "lng": 108
        },
        "accuracy": 868
      },
      "url": "http://localhost3000/login"
    },
  ]
}

export default mockData
