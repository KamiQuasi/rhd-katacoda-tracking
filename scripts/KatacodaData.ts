declare var firebase: any;

class KatacodaData {
    _totals: any;
    _courses = {};
    _locations: any;

    get totals() {
        return this._totals;
    }
    set totals(docRef) {
        this._totals = docRef;
        let userEle = document.querySelector('#total-users');
        let completionEle = document.querySelector('#total-complete');
        if (userEle) {
            userEle.innerHTML = this._totals.users ? this._totals.users.toString() : '--';
        }
        if (completionEle) {
            completionEle.innerHTML = this._totals.complete ? this._totals.complete.toString() : '--';
        }
        //console.log('Totals', this._totals);
    }
    
    get courses() {
        return this._courses;
    }
    set courses(docRef) {
        this._courses = docRef;
        let courseEle = document.querySelector('#total-courses');
        if (courseEle) {
            courseEle.innerHTML = Object.keys(this._courses).length.toString();
        }
        let courseList = document.querySelector('#courses');
        for (let [key, value] of Object.entries(this._courses)) {
            let course = new KatacodaCourse(key, value);
            let ele = document.createElement('li');
            ele.innerHTML = `${course}`;//`${course.name} - ${course.complete ? `${course.complete} Completed |`: ''} | ${course.labels}`;
            if (courseList) {
                courseList.append(ele);
            }
        }
        //console.log('Courses', this._courses);
    }

    get locations() {
        return this._locations;
    }
    set locations(docRef) {
        this._locations = docRef;
        let locationList = document.querySelector('#locations');
        for (let [key, val] of Object.entries(this._locations)) {
            let ele = document.createElement('li');
            ele.innerHTML = `<strong>${key}</strong> - ${val.users} <em>Users</em> | ${val.totals && val.totals.complete ? val.totals.complete : '0'} <em>Course Completions</em>`;
            if (locationList) {
                locationList.append(ele);
            }
        }
        //console.log('Locations', this._locations);
    }
    constructor() {
        firebase.firestore().collection('2019-09-16').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                this[doc.id] = doc.data();
            });
        });
    }

    report() {
        console.log('Totals', this.totals);
        console.log('Courses', this.courses);
        console.log('Locations', this.locations);
    }

}

class KatacodaCourse {
    name: string
    complete?: number
    labels: KatacodaLabel[] = [];

    constructor(name: string, labels:{ [name: string]: KatacodaLabel }) {
        this.name = name;
        for (let [key, value] of Object.entries(labels)) {
            this.labels.push(new KatacodaLabel(key, value));
        }
    }

    toString() {
        return `${this.name}
        <ul>
            ${this.labels.reduce((prev,curr) => { return `${prev}
        <li>${curr}</li>`})
        }
        </ul>`;
    }

    
}

class KatacodaLabel {
    name: string
    time: number[]
    total: number

    constructor(name:string, data:{time:number[], total:number}) {
        this.name = name;
        this.time = data.time;
        this.total = data.total;
    }

    toString() {
        let avgTime = this.time ? this.time.reduce((prev,curr)=> {
            return prev+curr;
        })/this.time.length : 0;
        return `${this.name} - ${avgTime/3600} Seconds`;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    // // The Firebase SDK is initialized and available here!
    let katacoda = new KatacodaData();
    // katacoda.report();
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    
});