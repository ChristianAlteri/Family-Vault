class Node {
    constructor(name){
        this.name = name;
        this.father = null; // left
        this.mother = null; // right
    }
}


// -------------------------------------------------------------This should all happen when creating a new user. 
const snooki = new Node('snooki')
const sammi = new Node('sammi')
const ronnie = new Node('ronnie')
const pauly = new Node('pauly')
const micheal = new Node('micheal')
const jwoww = new Node('jwoww')
const vinny = new Node('vinny')
// come up with a way to figure this out without hardcoding
// use the source_id and side_id. 
snooki.mother = sammi;
snooki.father = ronnie;
ronnie.mother = micheal;
ronnie.father = pauly;
sammi.mother = jwoww;
sammi.father = vinny;
console.log(snooki); // prints a tree like object




// -------------------------------------------------------------This should happen when you hit the '/' route.
const bfs = (root) => {
    const queue =  [ root ];
    while (queue.length > 0) {
        const curr = queue.shift();
        console.log(curr.name);
        if (curr.father !== null) {
            queue.push(curr.father);
        }
        if (curr.mother !== null) {
            queue.push(curr.mother);
        }
    }
}
bfs(snooki)

// run
// node ./helper/binaryTree.js