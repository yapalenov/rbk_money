const Altruist = require('./models.js').Altruist;
const Kidala = require('./models.js').Kidala;
const Hitrets = require('./models.js').Hitrets;
const Random = require('./models.js').Random;
const Zlopamyatny = require('./models.js').Zlopamyatny;
const Ushly = require('./models.js').Ushly;
const Geek = require('./models.js').Geek;

const MY_VARIANT = false;

const dealer_types = MY_VARIANT ?
['Geek', 'Kidala', 'Hitrets', 'Random', 'Zlopamyatny', 'Ushly']
:['Altruist', 'Kidala', 'Hitrets', 'Random', 'Zlopamyatny', 'Ushly'];
const dealers_count = 60;

let dealers = [];
let dealers_not_ready = [];
let types_counter = {}
create_dealers();
update_types_counter();

while (!check_finish()) {
  update_types_counter();
  while(dealers_not_ready.length > 0) {
    make_deal();
  }
  dealers.sort(down_sort);
  update_dealers()
  types_counter_incr();
  iteration_result();
}



//----------------------------------//
function create_dealers() {
  for (let i = 0; i < dealer_types.length; i++) {
    for (let j = 0; j < Math.floor(dealers_count / dealer_types.length); j++) {
      dealers_not_ready.push({id: dealers.length});
      dealers.push(create_dealer(dealer_types[i], dealers.length, dealers_count));
    }
  }
}
function create_dealer(name, id) {
  if (name == "Altruist") return new Altruist(id, dealers_count);
  if (name == "Kidala") return new Kidala(id, dealers_count);
  if (name == "Hitrets") return new Hitrets(id, dealers_count);
  if (name == "Random") return new Random(id, dealers_count);
  if (name == "Zlopamyatny") return new Zlopamyatny(id, dealers_count);
  if (name == "Ushly") return new Ushly(id, dealers_count);
  if (name == "Geek") return new Geek(id, dealers_count);
}
function make_deal(iter) {
  let dealer_id = dealers_not_ready[Math.floor(Math.random() * dealers_not_ready.length)].id;
  let dealer = dealers.find((e) => { return e.id == dealer_id; });
  let oponent_id = dealer.get_oponent_id;
  let oponent = dealers.find((e) => { return e.id == oponent_id; });
  dealer.deal(oponent);

  if (dealer.is_ready) {
    dealers_not_ready.forEach((item, i)=>{
      if (item.id == dealer.id) dealers_not_ready.splice(i, 1);
    })
  }
  if (oponent.is_ready) {
    dealers_not_ready.forEach((item, i)=>{
      if (item.id == oponent.id) dealers_not_ready.splice(i, 1);
    })
  }
}
function down_sort(a, b){
  if (a.coins < b.coins) {
    return 1
  }

  if (a.coins > b.coins) {
    return -1
  }

  return 0;
}
function update_dealers() {
  for (var i = 0; i < 12; i++) {
    dealers.splice(-i - 1, 1, create_dealer(dealers[i]._name, dealers[59-i]._id));
  }
  dealers.forEach((item, i)=>{
    item.reset(dealers_count);
    dealers_not_ready.push({id: i});
   })
}
function types_counter_incr() {
  dealers.forEach((item, i)=> {
    if (item._name == 'Altruist') {types_counter.Altruist++};
    if (item._name == 'Kidala') {types_counter.Kidala++};
    if (item._name == 'Hitrets') {types_counter.Hitrets++};
    if (item._name == 'Random') {types_counter.Random++};
    if (item._name == 'Zlopamyatny') {types_counter.Zlopamyatny++};
    if (item._name == 'Ushly') {types_counter.Ushly++};
    if (item._name == 'Geek') {types_counter.Geek++};
  })
}
function update_types_counter() {
  dealer_types.forEach((item, i)=>{
    types_counter[item] = 0;
  })
}
function iteration_result() {
  console.clear();
  console.log('Altruist: ' + types_counter.Altruist);
  console.log('Kidala: ' + types_counter.Kidala);
  console.log('Hitrets: ' + types_counter.Hitrets);
  console.log('Random: ' + types_counter.Random);
  console.log('Zlopamyatny: ' + types_counter.Zlopamyatny);
  console.log('Ushly: ' + types_counter.Ushly);
  console.log('Geek: ' + types_counter.Geek);
}
function check_finish() {
  for (let prop in types_counter) {
    if (types_counter[prop] == 60) return true;
  }
  return false;
}
