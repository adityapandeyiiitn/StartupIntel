// Comprehensive domain map: keyword (substring of slug) → real domain
const domainMap = {
  // Food Delivery
  'zomato': 'zomato.com', 'swiggy': 'swiggy.com', 'zepto': 'zepto.com',
  'blinkit': 'blinkit.com', 'dunzo': 'dunzo.in', 'magicpin': 'magicpin.in',
  'eatsure': 'eatsure.com', 'freshmenu': 'freshmenu.com',

  // Fintech / Payments
  'paytm': 'paytm.com', 'phonepe': 'phonepe.com', 'razorpay': 'razorpay.com',
  'cred': 'cred.club', 'groww': 'groww.in', 'zerodha': 'zerodha.com',
  'upstox': 'upstox.com', 'mobikwik': 'mobikwik.com', 'bharatpe': 'bharatpe.com',
  'billdesk': 'billdesk.com', 'pinelabs': 'pinelabs.com', 'cashfree': 'cashfree.com',
  'instamojo': 'instamojo.com', 'simpl': 'getsimpl.com', 'lazypay': 'lazypay.in',
  'zestmoney': 'zestmoney.in', 'kreditbee': 'kreditbee.in', 'moneytap': 'moneytap.com',
  'stashfin': 'stashfin.com', 'lendingkart': 'lendingkart.com',
  'indialends': 'indialends.com', 'yubi': 'yubi.co', 'rupeek': 'rupeek.com',
  'navi': 'navi.com', 'jar-gold': 'jar.app', 'fi-money': 'fi.money',
  'jupiter': 'jupiter.money', 'slice': 'sliceit.com', 'uni-cards': 'unicards.in',
  'hubble': 'hubble.money', 'freo': 'freopay.com', 'fibe': 'fibe.in',
  'progcap': 'progcap.com', 'paisabazaar': 'paisabazaar.com',
  'policybazaar': 'policybazaar.com', 'turtlemint': 'turtlemint.com',
  'godigit': 'godigit.com', 'acko': 'acko.com', 'digit-insurance': 'godigit.com',
  'open-money': 'open.money', 'zeta': 'zeta.tech', 'skydo': 'skydo.com',
  'cashify': 'cashify.in',

  // E-commerce / D2C
  'flipkart': 'flipkart.com', 'meesho': 'meesho.com', 'myntra': 'myntra.com',
  'snapdeal': 'snapdeal.com', 'shopclues': 'shopclues.com', 'nykaa': 'nykaa.com',
  'pepperfry': 'pepperfry.com', 'urban-ladder': 'urbanladder.com',
  'furlenco': 'furlenco.com', 'rentomojo': 'rentomojo.com',
  'plum-goodness': 'plumhq.com', 'mcaffeine': 'mcaffeine.in',
  'mamaearth': 'mamaearth.in', 'minimalist': 'theminimalist.in',
  'beardo': 'beardo.in', 'boat': 'boat-lifestyle.com', 'noise': 'gonoise.com',
  'wakefit': 'wakefit.co', 'sleepycat': 'sleepycat.in', 'duroflex': 'duroflex.com',
  'netmeds': 'netmeds.com', 'medlife': 'medlife.com', 'lenskart': 'lenskart.com',
  'firstcry': 'firstcry.com', 'purplle': 'purplle.com', 'sugar-cosmetics': 'sugarcosmetics.com',
  'prestige-kitchen': 'prestigecooker.com', 'havells': 'havells.com',
  'orient-electric': 'orientelectric.com', 'crompton': 'crompton.co.in',
  'bajaj-electricals': 'bajajelectricals.com', 'butterfly': 'butterflyfields.in',
  'usha-home': 'usha.com', 'healthkart': 'healthkart.com',

  // Edtech
  'byju': 'byjus.com', 'unacademy': 'unacademy.com', 'upgrad': 'upgrad.com',
  'physicswallah': 'physicswallah.live', 'pw-': 'physicswallah.live',
  'toppr': 'toppr.com', 'cuemath': 'cuemath.com', 'lido': 'lidolearning.com',
  'great-learning': 'greatlearning.in', 'planetspark': 'planetspark.in',
  'hero-vired': 'herovired.com', 'sunstone': 'sunstone.edu.in',
  'stoa': 'stoa.school', 'altuni': 'altuni.in', 'classplus': 'classplusapp.com',

  // SaaS / B2B
  'zoho': 'zoho.com', 'freshworks': 'freshworks.com', 'postman': 'postman.com',
  'browserstack': 'browserstack.com', 'chargebee': 'chargebee.com',
  'clevertap': 'clevertap.com', 'webengage': 'webengage.com',
  'darwinbox': 'darwinbox.com', 'keka': 'keka.com', 'sprinto': 'sprinto.com',
  'zenoti': 'zenoti.com', 'rocketlane': 'rocketlane.com',
  'hasura': 'hasura.io', 'signoz': 'signoz.io', 'devtron': 'devtron.ai',
  'acceldata': 'acceldata.io', 'letstrack': 'letstrack.com',
  'elasticrun': 'elasticrun.com',

  // Healthtech
  'practo': 'practo.com', 'medibuddy': 'medibuddy.in', 'pharmeasy': 'pharmeasy.in',
  '1mg': '1mg.com', 'apollo-247': 'apollo247.com', 'apollo247': 'apollo247.com',
  'lybrate': 'lybrate.com', 'docsapp': 'docsapp.in', 'mfine': 'mfine.com',
  'orange-health': 'orangehealth.in', 'fitterfly': 'fitterfly.com',
  'clinikally': 'clinikally.com', 'pristyn': 'pristyncare.com',
  'callhealth': 'callhealth.com', 'healthians': 'healthians.com',

  // Food & Beverage brands
  'blue-tokai': 'bluetokaicoffee.com', 'chaayos': 'chaayos.com',
  'chai-point': 'chaipoint.com', 'third-wave': 'thirdwavecoffee.in',
  'sleepy-owl': 'sleepyowl.com', 'rage-caffeine': 'ragecoffee.com',
  'bira-91': 'bira91.com', 'freshtohome': 'freshtohome.com',
  'licious': 'licious.in', 'id-idly': 'idfreshfood.com',
  'id-fresh': 'idfreshfood.com',

  // Logistics
  'delhivery': 'delhivery.com', 'shiprocket': 'shiprocket.in',
  'shadowfax': 'shadowfax.in', 'rivigo': 'rivigo.com',
  'ninjacart': 'ninjacart.in', 'zypp': 'zypp.in',

  // Mobility / EV
  'ola': 'olacabs.com', 'uber': 'uber.com', 'rapido': 'rapido.bike',
  'altigreen': 'altigreen.com', 'euler-motors': 'eulermotors.com',
  'pixxel': 'pixxel.space',

  // Agritech
  'cropin': 'cropin.com', 'dehaat': 'agrevolution.in',
  'agnikul': 'agnikul.in', 'skyroot': 'skyroot.in',
  'dhruva-space': 'dhruvaspace.com', 'ideaforge': 'ideaforge.in',
  'galaxeye': 'galaxeye.space',

  // Social / Media
  'inmobi': 'inmobi.com', 'sharechat': 'sharechat.com',
  'pocketfm': 'pocketfm.com', 'pratilipi': 'pratilipi.com',
  'dailyhunt': 'dailyhunt.in',

  // IT Services
  'wipro': 'wipro.com', 'tcs': 'tcs.com', 'infosys': 'infosys.com',
  'hcl': 'hcltech.com',

  // Other well-known
  'droom': 'droom.in', 'cult-fit': 'cult.fit', 'cultfit': 'cult.fit',
  'urban-clap': 'urbancompany.com', 'urbanclap': 'urbancompany.com',
  'dunzo': 'dunzo.in', 'porter': 'porter.in', 'yulu': 'yulu.bike',
};

module.exports = domainMap;
