class Dealer {
  constructor (id, name, dealers_count) {
    this._id = id;
    this._name = name;
    this._coins = 0;
    this._oponent_last_step = true;
    this._step_number = 0;
    this._oponent_lied = false;
    this._oponents_steps_counter = [];
    this._is_ready_count = 0;
    this._false_count = 0;
    this._strategy = [true, false, true, true];
    this._kidala_strategy = '';
    let set_steps = () => {
      for (let i = 0; i < dealers_count; i++) {
        this._oponents_steps_counter.push({id: i, steps: 0, is_ready: false})
      }
    }
    set_steps();
  }

  reset(dealers_count) {
    let set_steps = () => {
      for (let i = 0; i < dealers_count; i++) {
        this._oponents_steps_counter.push({id: i, steps: 0, is_ready: false})
      }
    }
    this._coins = 0;
    this._oponent_last_step = true;
    this._step_number = 0;
    this._oponent_lied = false;
    this._oponents_steps_counter = [];
    this._is_ready_count = 0;
    this._strategy = [true, false, true, true];
    this._kidala_strategy = '';
    this._false_count = 0;
    set_steps();
  }

  //Вводим 5% вероятность ошибки
  step_now() {
    let rand = Math.floor(Math.random()*20);
    let five_error =  rand == 19;
    return five_error ? !this.calculate_step() : this.calculate_step();
  }
  //Инкремент шага
  step_incr() {
    this._step_number = this._step_number + 1
  }

  set oponents_steps_counter(id) {
    this._oponents_steps_counter.forEach((item, i)=> {
      if(item.id == id) {
          item.steps++;
          if (item.steps > 4 && !item.is_ready) {this._is_ready_count++; item.is_ready = true}
          if (item.steps > 9) this._oponents_steps_counter.splice(i, 1);
      }
    });

  }


  set oponent_last_step(step) {
    this._oponent_last_step = step;
    if (!step) this._oponent_lied = true;
  }

  get oponent_last_step() {
    return this._oponent_last_step;
  }

  set coins(sum) {
    this._coins = this._coins + sum;
  }

  get coins() {
    return this._coins;
  }

  set id(id) {
    this._id = id;
  }

  get id() {
    return this._id;
  }

  get get_oponent_id () {
    return this._oponents_steps_counter[Math.floor(Math.random() * this._oponents_steps_counter.length)].id;
  }

  get is_ready() {
      return this._is_ready_count == 60 ? true : false;
  }

  deal(dealer) {
    let self_step = this.step_now();
    let oponent_step = dealer.step_now();
    if (self_step && oponent_step) {
      this.coins = 4;
      dealer.coins = 4;
    } else if (self_step && !oponent_step) {
      this.coins = 1;
      dealer.coins = 5;
    } else if (!self_step && oponent_step) {
      this.coins = 5;
      dealer.coins = 1;
    } else {
      this.coins = 2;
      dealer.coins = 2;
    }
    this.oponent_last_step = oponent_step;
    dealer.oponent_last_step = self_step;
    this.step_incr();
    dealer.step_incr();
    this.oponents_steps_counter = dealer.id;
    dealer.oponents_steps_counter = this.id;
  }
}

module.exports.Altruist = class Altruist extends Dealer {
  constructor(id, dealers_count) {
    super(id, "Altruist", dealers_count);
  }
  calculate_step() {
    return true;
  }
}

module.exports.Kidala = class Kidala extends Dealer {
  constructor(id, dealers_count) {
    super(id, "Kidala", dealers_count);
  }
  calculate_step() {
    return false;
  }
}

module.exports.Hitrets = class Hitrets extends Dealer {
  constructor(id, dealers_count) {
    super(id, "Hitrets", dealers_count);
  }
  calculate_step() {
    return this._oponent_last_step;
  }
}

module.exports.Random = class Random extends Dealer {
  constructor(id, dealers_count) {
    super(id, "Random", dealers_count);
  }
  calculate_step() {
    return Math.floor(Math.random()*2) == 1;
  }
}

module.exports.Zlopamyatny = class Zlopamyatny extends Dealer {
  constructor(id, dealers_count) {
    super(id, "Zlopamyatny", dealers_count);
  }
  calculate_step() {
    return this._oponent_lied  ? false : true;
  }
}

module.exports.Ushly = class Ushly extends Dealer {
  constructor(id, dealers_count) {
    super(id, "Ushly", dealers_count);
  }
  calculate_step() {
    if (this._step_number < 4) {
      return this._strategy[this._step_number]
    } else if (this._step_number == 4) {
      this._kidala_strategy = this._oponent_lied ? true : false;
      return this._kidala_strategy ? false : this._oponent_last_step;
    } else {
      return this._kidala_strategy ? false : this._oponent_last_step;
    }
  }
}

module.exports.Geek = class Geek extends Dealer {
  constructor(id, dealers_count) {
    super(id, "Geek", dealers_count);
  }
  calculate_step() {
    return this._false_count > 550 ? true : false;
  }
}

module.exports.create_dealer = Dealer.create_dealer;
