declare var firebase: any;

class Katacoda {
    metrics: any
    url: URL
    course: string
    loc: string

    constructor() {
        // this.katacoda = firebase.firestore().collection('katacoda');
        // this.users = firebase.firestore().collection('users');
        let dt = new Date();
        this.metrics = firebase.firestore().collection(dt.toISOString().substr(0, 10));
        this.url = new URL(location.href);
        this.course = typeof this.url.pathname !== 'undefined' && this.url.pathname.length > 1 ? this.url.pathname.replace(/\//g,'--').substr(1) : 'some--course--';
        this.loc = (this.url.searchParams.get('loc') || 'site');

        this.listen = this.listen.bind(this);
    }

    listen() {
        let metrics = this.metrics;
        let course = this.course;
        let loc = this.loc;
        let locObj = {};
        let id = (new Date()).getTime().toString();
        // Count a new user; reloads and delays in starting can affect the end results
        metrics.doc('totals').set({
            users: firebase.firestore.FieldValue.increment(1) 
        }, {merge: true})
        locObj[loc] = {
            users: firebase.firestore.FieldValue.increment(1)
        };
        metrics.doc('locations').set(locObj,{merge:true});
        // metrics.doc('courses').set(courseObj, {merge: true});
        window.addEventListener('message',function(e) {
            let d = e.data;
            if(e && e.origin && e.origin.indexOf('katacoda.com') >= 0) {
              //let scenario = katacoda.doc(course+d.scenario.replace(/\//g,'--'));
              let labels = {}; // scenario.collection('actions');
              let action = d.action//actions.doc(d.action);
              let label = d.label ? d.label : action;
              let coursename = course+d.scenario.replace(/\//g,'--');
              let courseObj = {};
              courseObj[coursename] = {labels:{}};
              courseObj[coursename].labels[label] = {
                total: firebase.firestore.FieldValue.increment(1),
                time: firebase.firestore.FieldValue.arrayUnion(e.timeStamp)
              }
              // count the total number and timing of starts, steps, last_step, and finish for a course
              metrics.doc('courses').set(courseObj, {merge: true});
            //   .collection(coursename).doc(label).set({
            //     total: firebase.firestore.FieldValue.increment(1),
            //     time: firebase.firestore.FieldValue.arrayUnion(e.timeStamp)
            //     }, {merge: true});
              if (d.action === 'finish') {
                // Count the total number complete
                metrics.doc('totals').set({
                    complete: firebase.firestore.FieldValue.increment(1)
                }, {merge: true});
                courseObj[coursename].complete = firebase.firestore.FieldValue.increment(1);
                metrics.doc('courses').set(courseObj, {merge: true});
                // Count total number complete for location/workstation
                locObj[loc] = { totals: { complete: firebase.firestore.FieldValue.increment(1) } };
                metrics.doc('locations').set(locObj, {merge: true});
              }
            }
        }, false);
    }
}
/*
metrics
    totals
        users
    courses
        {coursename}
            {step}
                total: int
                time: timestamp
    locations
        {location}
            totals
                complete: int
*/

document.addEventListener('DOMContentLoaded', function() {
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    // // The Firebase SDK is initialized and available here!
    firebase.initializeApp({
        "apiKey": "AIzaSyA-xSsRmfOSyUrlj1S5HphBMKXo7o7ihPM",
        "appId": "1:984574064549:web:912913e4664ef5538b1a4c",
        "databaseURL": "https://rhd-katacoda-tracking.firebaseio.com",
        "storageBucket": "rhd-katacoda-tracking.appspot.com",
        "authDomain": "rhd-katacoda-tracking.firebaseapp.com",
        "messagingSenderId": "984574064549",
        "projectId": "rhd-katacoda-tracking"
      });
    let katacoda = new Katacoda();
    katacoda.listen()
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    
});