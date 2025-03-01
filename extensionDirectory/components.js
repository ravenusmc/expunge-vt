//Vue Components

Vue.component('docket-caption', {
  template: (`<div class="docket-caption"> 
      <div class="docket-caption__names">
      <p class="docket-caption__party">State of Vermont,</p>
      <p>v.</p>
      <p class="docket-caption__party">{{name}}</p>
      <p class="docket-caption__label">Petitioner</p>
      </div>
      <div class="capParens">
          )<br>)<br>)<br>)
        </div>
      </div>
      `),
  props: ['name']
});

Vue.component('filing-nav', {
  template: (`<div class="filing-nav no-print" id="filing-nav"> 
      <ol>
        <li v-for="group in filings" class="filing-nav__parent-link">
        <a href v-bind:href="'#'+group.county">{{group.county}}</a>
        <ol>
          <li v-for="filing in group.filings" class="filing-nav__child-link"><a v-bind:href="'#'+filing.id">{{filing.title}}</a>
          <p class="filing-nav__counts">{{filing.numCountsString}}, {{filing.numDocketsString}}</p>
          </li>
        </ol>
        </li>
        <li class="filing-nav__parent-link">
          <a href="#extra-documents">Extra Documents</a>
          <ol>
            <li class="filing-nav__child-link">
              <a href="#clinic-checkout">Clinic Record</a>
            </li>
            <li class="filing-nav__child-link">
              <a href="#client-checkout">Client Summary Sheet</a>
            </li>
          </ol>
        </li>
      </ol>
      </div>
      `),
  props: ['filings']
});

Vue.component('filing-footer', {
  template: (`<div class="stipulated-closing" v-if="stipulated">
                  <p class="stipulated-closing__dates"><span class="bold">Stipulated and agreed</span> this <span class="fill-in">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> day of <span class="fill-in">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>, 20<span class="fill-in">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>.</p>
                  <div class="filing-closing__signature-box">
                      <p class="filing-closing__name">State's Attorney/Attorney General</p>
                  </div>
              </div>
          </div>
          `),
  props: ['stipulated']
});

Vue.component('filing-dated-city', {
  template: (`
    <p class="filing-dated-city indent">Dated in <span class="fill-in">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>, this <span class="fill-in">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> day of <span class="fill-in">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>, 20<span class="fill-in">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>.</p>
  `)
});

Vue.component('pills-row', {
  template: (`<div class="card-header__pills-row">
                <span v-if="count.offenseClass =='mis'" class="pill pill--rounded pill--outline-green">
                        Mis
                </span>
                <span v-if="count.offenseClass == 'fel'" class="pill pill--rounded pill--outline-black">
                        Fel
                </span>
                <template v-if="count.offenseDisposition">
                <span v-if="count.isDismissed === true" class="pill pill--rounded pill--outline-green">
                    {{count.offenseDisposition}}
                </span>
                <span v-if="count.isDismissed === false" class="pill pill--rounded pill--outline-black">
                    {{count.offenseDisposition}}
                </span>
                </template>
                <template v-if="count.dispositionDate">
                <span v-if="decimalAgeInYears(count.dispositionDate) < 18" class='pill pill--rounded pill--outline-green'> Under 18 </span>
                <span v-if="decimalAgeInYears(count.dispositionDate) >= 18 && decimalAgeInYears(count.dispositionDate) < 21" class='pill pill--rounded pill--outline-green'> Under 21 </span>
                <span v-if="decimalAgeInYears(count.dispositionDate) >= 21" class='pill pill--rounded pill--outline-black'> Adult </span>
                </template>
                <span v-if="count.outstandingPayment == true" class='pill pill--rounded pill--outline-black'>Surcharge</span>

            </div>
          `),
  props: ['count','dob'],
  methods: {
    decimalAgeInYears: function (value) {
      if (!value) return ''
      if (!this.dob) return ''
      let fromTime = moment(value).diff(moment(this.dob))
      let duration = moment.duration(fromTime)

      console.log(value, this.dob)
      return duration.asDays()/365.25
    },
  }
});

Vue.component('filing-type-heading', {
  methods: {
  getCheckoutPhrases(fType) {
    checkoutPhrases=[
      {type: "ExC", stipType: "StipExC", phrase: "The following are prior conviction(s) for which we prepared a petition to expunge:"},
      {type: "ExNC", stipType: "StipExNC", phrase: "The following are cases that DID NOT result in a conviction and we prepared a petition to expunge:"},
      {type: "ExNCrim", stipType: "StipExNCrim", phrase: "The following are counts that are no longer crimes and we prepared a petition to expunge:"},
      {type: "SC", stipType: "StipSC", phrase: "The following are prior convictions and we prepared a petition to seal:"},
      {type: "SDui", stipType: "StipSDui", phrase: "The following is a prior DUI conviction and we filed a petition to seal:"}
    ]

    for (i = 0; i<checkoutPhrases.length; i++) {
      if (checkoutPhrases[i]["type"] == fType || checkoutPhrases[i]["stipType"] == fType) {
        return checkoutPhrases[i]["phrase"]
      }
    }
    console.log(checkoutPhrases)
  }},
  template: (`
  <div>
      <p>
        {{getCheckoutPhrases(heading)}}
      </p>
  </div>
  `),
  props: ['heading']
});