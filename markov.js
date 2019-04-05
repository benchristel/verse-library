define({
  'test an empty Markov model'() {
    // '#' is the placeholder character meaning "I have no clue"
    assert(Markov().predict('a'), is, '#')
  },
  
  'test a Markov model predicts what comes next'() {
    let model = Markov()
      .observe('a', 'b')

    assert(model.predict('a'), is, 'b')
  },
  
  'test a Markov model cannot predict what it has never seen'() {
    let model = Markov()
      .observe('a', 'b')

    assert(model.predict('b'), is, '#')
  },
  
  'test a Markov model with multiple relevant observations'() {
    let model = Markov()
      .observe('a', 'foo')
      .observe('a', 'bar')
    
    let results = range(1, 30).map(_=> model.predict('a'))
    assert(results, contains, 'foo')
    assert(results, contains, 'bar')
  },
  
  'test a Markov model remembers frequency'() {
    let model = Markov()
      .observe('a', 'normal')
      .observe('a', 'normal')
      .observe('a', 'normal')
      .observe('a', 'normal')
      .observe('a', 'weird')
    
    let results = range(1, 100).map(_=> model.predict('a'))
    assert(results.filter(eq('normal')).length, isGt, 70)
    assert(results, contains, 'weird')
  },
  
  isGt(threshold, n) {
    return n > threshold
  },
  
  eq: a => b => a === b,
  add(a, b) { return a + b },
  
  Markov() {
    const observations = {}
    const self = {
      predict,
      observe,
    }
    return self

    function predict(prev) {
      let possibilities = observations[prev]
      if (possibilities) {
        return chooseRandom(possibilities)
      } else {
        return '#'
      }
    }
    
    function observe(prev, next) {
      observations[prev] = observations[prev] || {}
      observations[prev][next] = observations[prev][next] || 0
      observations[prev][next]++
      return self
    }
    
    function chooseRandom(weights) {
      let options = Object.keys(weights)
      let totalWeight = Object.values(weights).reduce(add)
      let tippingPoint = Math.random() * totalWeight
      
      let accumulatedWeight = 0
      for (let candidate of options) {
        accumulatedWeight += weights[candidate]
        if (accumulatedWeight > tippingPoint) {
          return candidate
        }
      }
      throw Error('unreachable code in chooseRandom!')
    }
  },
  
  /* // uncomment this section to turn this into an interactive demo
  *run() {
    let text = 'the rain in spain falls mainly on the plain'
    let model = Markov()
    for (let i = 0; i < text.length - 1; i++) {
      model.observe(text[i], text[i + 1])
    }
    let out = 'a'
    for (_ of range(1, 100)) {
      out += model.predict(out[out.length - 1])
    }
    yield output(out)
    yield retry(run)
  }
  */
})
