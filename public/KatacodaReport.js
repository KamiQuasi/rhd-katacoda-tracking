"use strict";
const dateList = [
    '2020-06-01',
    '2020-06-02',
    '2020-06-03',
    '2020-06-04',
    '2020-06-05',
    '2020-06-06',
    '2020-06-07',
    '2020-06-08',
    '2020-06-09',
    '2020-06-10',
    '2020-06-11',
    '2020-06-12',
    '2020-06-13',
    '2020-06-14',
    '2020-06-15',
    '2020-06-16',
    '2020-06-17',
    '2020-06-18',
    '2020-06-19',
    '2020-06-20',
    '2020-06-21',
    '2020-06-22',
    '2020-06-23',
    '2020-06-24',
    '2020-06-25',
    '2020-06-26',
    '2020-06-27',
    '2020-06-28',
    '2020-06-29',
    '2020-06-30',
    '2020-07-01',
    '2020-07-02',
    '2020-07-03',
    '2020-07-04',
    '2020-07-05',
    '2020-07-06',
    '2020-07-07',
    '2020-07-08',
    '2020-07-09',
    '2020-07-10',
    '2020-07-11',
    '2020-07-12',
    '2020-07-13',
    '2020-07-14',
    '2020-07-15',
    '2020-07-16',
    '2020-07-17',
    '2020-07-18',
    '2020-07-19',
    '2020-07-20',
    '2020-07-21',
    '2020-07-22',
    '2020-07-23',
];
const courses = [
    { id: 'getting-started', name: 'Getting Started with OpenShift', key: '-courses--openshift--getting-startedintroduction--getting-started', link: 'https://developers.redhat.com/courses/openshift/getting-started' },
    { id: 'deploy-images', name: 'Deploy application from images', key: '-courses--foundations--deploy-imagesintroduction--deploying-images', link: 'https://developers.redhat.com/courses/foundations/deploy-images' },
    { id: 'openshift-playground', name: 'OpenShift 4.4 playground', key: '-courses--openshift--playground-openshiftplaygrounds--openshift44', link: 'https://developers.redhat.com/courses/openshift/playground-openshift' }
];
class KatacodaReport extends HTMLElement {
    constructor() {
        super();
        this.totals = [];
        this.courses = [];
        this.locations = [];
        this.data = {};
        this.template = `<h1>Katacoda Data</h1>
    ${courses.reduce((acc, c) => `${acc}<section>
    <h2>${c.name}</h2>
    <table id="${c.id}">
    <tr><th>Date</th><th>Complete</th><th span="10">|Steps(users)|</th></table>
    </section>`, '')}`;
        dateList.map(dt => {
            firebase.firestore().collection(dt).doc('courses').get().then(doc => {
                if (doc.exists) {
                    courses.map(course => {
                        let data = doc.data();
                        if (data[course.key]) {
                            let complete = typeof data[course.key]['complete'] !== 'undefined' ? data[course.key]['complete'] : 0;
                            let labels = [];
                            if (data[course.key]['labels']) {
                                Object.entries(data[course.key]['labels']).forEach(entry => {
                                    let k = entry[0];
                                    let v = entry[1];
                                    labels.push(`|${k}(${v['total'] || ''})|`);
                                    labels.push(v['time']);
                                    //labels.push(`${v['time'] ? v['time'].reduce((a,c) => `${a}${c},`,''):''}`);
                                });
                            }
                            let row = document.createElement('tr');
                            row.innerHTML = `<td>${dt}</td><td>${complete}</td>${labels.reduce((a, c) => `${a}<td>${c}</td>`, '')}`;
                            let courseTbl = document.querySelector('#' + course.id);
                            if (courseTbl) {
                                courseTbl.appendChild(row);
                            }
                        }
                    });
                }
                else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(function (error) {
                console.log("Error getting document:", error);
            });
        });
    }
    // static observedAttributes() { return ['url']; }
    // attributeChangedCallback(attr, newVal, oldVal) {
    // }
    connectedCallback() {
        this.innerHTML = this.template;
    }
    // get totals() {
    //     return this._totals;
    // }
    // set totals(va) {
    //     this._totals = docRef;
    //     let userEle = document.querySelector('#total-users');
    //     let completionEle = document.querySelector('#total-complete');
    //     if (userEle) {
    //         userEle.innerHTML = this._totals.users ? this._totals.users.toString() : '--';
    //     }
    //     if (completionEle) {
    //         completionEle.innerHTML = this._totals.complete ? this._totals.complete.toString() : '--';
    //     }
    //     //console.log('Totals', this._totals);
    // }
    // get courses() {
    //     return this._courses;
    // }
    // set courses(docRef) {
    //     this._courses = docRef;
    //     let courseEle = document.querySelector('#total-courses');
    //     if (courseEle) {
    //         courseEle.innerHTML = Object.keys(this._courses).length.toString();
    //     }
    //     let courseList = document.querySelector('#courses');
    //     for (let [key, value] of Object.entries(this._courses)) {
    //         let course = new KatacodaCourse(key, value);
    //         let ele = document.createElement('li');
    //         ele.innerHTML = `${course}`;//`${course.name} - ${course.complete ? `${course.complete} Completed |`: ''} | ${course.labels}`;
    //         if (courseList) {
    //             courseList.append(ele);
    //         }
    //     }
    //     //console.log('Courses', this._courses);
    // }
    // get locations() {
    //     return this._locations;
    // }
    // set locations(docRef) {
    //     this._locations = docRef;
    //     let locationList = document.querySelector('#locations');
    //     for (let [key, val] of Object.entries(this._locations)) {
    //         let ele = document.createElement('li');
    //         ele.innerHTML = `<strong>${key}</strong> - ${val.users} <em>Users</em> | ${val.totals && val.totals.complete ? val.totals.complete : '0'} <em>Course Completions</em>`;
    //         if (locationList) {
    //             locationList.append(ele);
    //         }
    //     }
    //     //console.log('Locations', this._locations);
    // }
    report() {
        console.log('Totals', this.totals);
        console.log('Courses', this.courses);
        console.log('Locations', this.locations);
    }
}
// class KatacodaCourse {
//     name: string
//     complete?: number
//     labels: KatacodaLabel[] = [];
//     constructor(name: string, labels:{ [name: string]: KatacodaLabel }) {
//         this.name = name;
//         for (let [key, value] of Object.entries(labels)) {
//             this.labels.push(new KatacodaLabel(key, value));
//         }
//     }
//     toString() {
//         return `${this.name}
//         <ul>
//             ${this.labels.reduce((prev,curr) => { return `${prev.toString()}
//         <li>${curr.toString()}</li>`},'')
//         }
//         </ul>`;
//     }
// }
// class KatacodaLabel {
//     name: string
//     time: number[]
//     total: number
//     constructor(name:string, data:{time:number[], total:number}) {
//         this.name = name;
//         this.time = data.time;
//         this.total = data.total;
//     }
//     toString() {
//         let avgTime = this.time ? this.time.reduce((prev,curr)=> {
//             return prev+curr;
//         })/this.time.length : 0;
//         return `${this.name} - ${avgTime/3600} Seconds`;
//     }
// }
document.addEventListener('DOMContentLoaded', function () {
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    // // The Firebase SDK is initialized and available here!
    window.customElements.define('katacoda-report', KatacodaReport);
    // let data = [30, 86, 168, 281, 303, 365];
    // d3.select(".chart")
    // .selectAll("div")
    // .data(data)
    //     .enter()
    //     .append("div")
    //     .style("width", function(d) { return d + "px"; })
    //     .text(function(d) { return d; });
    // let katacoda = document.getElementsByTagName('')
    // if (katacoda) {
    //     katacoda.report();
    // }
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
});
