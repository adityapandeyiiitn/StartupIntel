const fs = require('fs');

const allDomains = {
  // Part 1-4 originals
  'Zomato': 'zomato.com',
  'Swiggy': 'swiggy.com',
  'CRED': 'cred.club',
  'Razorpay': 'razorpay.com',
  'Zepto': 'zeptonow.com',
  'Meesho': 'meesho.com',
  'Paytm': 'paytm.com',
  'Ola': 'olacabs.com',
  'Flipkart': 'flipkart.com',
  // Part 5 new companies
  'Zerodha': 'zerodha.com',
  'Groww': 'groww.in',
  'Upstox': 'upstox.com',
  'Nykaa': 'nykaa.com',
  'Purplle': 'purplle.com',
  'FirstCry': 'firstcry.com',
  'Lenskart': 'lenskart.com',
  'Urban Company': 'urbancompany.com',
  'Delhivery': 'delhivery.com',
  'Xpressbees': 'xpressbees.com',
  'Shiprocket': 'shiprocket.in',
  'Pine Labs': 'pinelabs.com',
  'BharatPe': 'bharatpe.com',
  'Udaan': 'udaan.com',
  'Moglix': 'moglix.com',
  'Zetwerk': 'zetwerk.com',
  'OfBusiness': 'ofbusiness.com',
  'Infra.Market': 'infra.market',
  'CarDekho': 'cardekho.com',
  'Spinny': 'spinny.com',
  'Cars24': 'cars24.com',
  'PharmEasy': 'pharmeasy.in',
  'Tata 1mg': '1mg.com',
  'Practo': 'practo.com',
  'Curefit': 'cult.fit',
  'Licious': 'licious.in',
  'FreshToHome': 'freshtohome.com',
  'Pepperfry': 'pepperfry.com',
  'UrbanLadder': 'urbanladder.com',
  'Livspace': 'livspace.com',
  'NoBroker': 'nobroker.in',
  'MakeMyTrip': 'makemytrip.com',
  'Ixigo': 'ixigo.com',
  'EaseMyTrip': 'easemytrip.com',
  'Oyo': 'oyorooms.com',
  'Unacademy': 'unacademy.com',
  'Byjus': 'byjus.com',
  'UpGrad': 'upgrad.com',
  'Vedantu': 'vedantu.com',
  'Eruditus': 'eruditus.com',
  'ShareChat': 'sharechat.com',
  'DailyHunt': 'dailyhunt.in',
  'Dream11': 'dream11.com',
  'MPL': 'mpl.live',
  'Games24x7': 'games24x7.com',
  'PolicyBazaar': 'policybazaar.com',
  'Digit Insurance': 'godigit.com',
  'Acko': 'acko.com',
  'Paytm Money': 'paytmmoney.com',
  'Mobikwik': 'mobikwik.com'
};

const files = [
  './backend/data/companiesPart1.js',
  './backend/data/companiesPart2.js',
  './backend/data/companiesPart3.js',
  './backend/data/companiesPart4.js',
  './backend/data/companiesPart5.js'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  Object.keys(allDomains).forEach(name => {
    const domain = allDomains[name];
    // Use Google's logo service which is always free and reliable
    const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    // Replace any existing logoUrl for this company
    const regex = new RegExp(`(name:\\s*['"]${name.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}['"][\\s\\S]*?logoUrl:\\s*)['"](https?://[^'"]*|/logos/[^'"]*)['"]`, 'g');
    content = content.replace(regex, `$1'${logoUrl}'`);
  });
  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});
console.log('All logos updated to Google Favicon API (sz=128).');
