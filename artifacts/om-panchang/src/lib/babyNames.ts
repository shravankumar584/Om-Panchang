// Nakshatra → 4 pada syllables (classical Jyotish mapping)
export const NAKSHATRA_SYLLABLES: Record<string, [string, string, string, string]> = {
  "Ashwini":          ["Chu", "Che", "Cho", "La"],
  "Bharani":          ["Li",  "Lu",  "Le",  "Lo"],
  "Krittika":         ["A",   "I",   "U",   "E"],
  "Rohini":           ["O",   "Va",  "Vi",  "Vu"],
  "Mrigashira":       ["Ve",  "Vo",  "Ka",  "Ki"],
  "Ardra":            ["Ku",  "Gha", "Na",  "Cha"],
  "Punarvasu":        ["Ke",  "Ko",  "Ha",  "Hi"],
  "Pushya":           ["Hu",  "He",  "Ho",  "Da"],
  "Ashlesha":         ["Di",  "Du",  "De",  "Do"],
  "Magha":            ["Ma",  "Mi",  "Mu",  "Me"],
  "Purva Phalguni":   ["Mo",  "Ta",  "Ti",  "Tu"],
  "Uttara Phalguni":  ["Te",  "To",  "Pa",  "Pi"],
  "Hasta":            ["Pu",  "Sha", "Na",  "Tha"],
  "Chitra":           ["Pe",  "Po",  "Ra",  "Ri"],
  "Swati":            ["Ru",  "Re",  "Ro",  "Ta"],
  "Vishakha":         ["Ti",  "Tu",  "Te",  "To"],
  "Anuradha":         ["Na",  "Ni",  "Nu",  "Ne"],
  "Jyeshtha":         ["No",  "Ya",  "Yi",  "Yu"],
  "Mula":             ["Ye",  "Yo",  "Bha", "Bhi"],
  "Purva Ashadha":    ["Bhu", "Dha", "Bha", "Dha"],
  "Uttara Ashadha":   ["Be",  "Bo",  "Ja",  "Ji"],
  "Shravana":         ["Ju",  "Je",  "Jo",  "Sha"],
  "Dhanishtha":       ["Ga",  "Gi",  "Gu",  "Ge"],
  "Shatabhisha":      ["Go",  "Sa",  "Si",  "Su"],
  "Purva Bhadrapada": ["Se",  "So",  "Da",  "Di"],
  "Uttara Bhadrapada":["Du",  "Tha", "Jha", "Na"],
  "Revati":           ["De",  "Do",  "Cha", "Chi"],
};

// Curated Hindu baby names per syllable sound
// Each entry: { boys, girls } with 6–10 names each
export const SYLLABLE_NAMES: Record<string, { boys: string[]; girls: string[] }> = {
  "Chu": { boys: ["Chudamani", "Chulbul", "Chuman"],             girls: ["Chumki", "Chulbuli", "Chuiya"] },
  "Che": { boys: ["Chetan", "Chetan Kumar", "Chetak"],           girls: ["Chetana", "Cheshta", "Cheena"] },
  "Cho": { boys: ["Chohel", "Chotur", "Chokkalingam"],          girls: ["Chola", "Choheli", "Chondrika"] },
  "La":  { boys: ["Lalit", "Laxman", "Lav", "Lavan", "Lalesh"], girls: ["Lalita", "Lata", "Lavanya", "Lakshmi", "Lajwanti", "Lasha"] },
  "Li":  { boys: ["Liladhar", "Lilesh", "Lingaraj"],            girls: ["Lila", "Lisha", "Lina", "Lilavati", "Lipi"] },
  "Lu":  { boys: ["Luv", "Lubhav", "Luthar"],                   girls: ["Luna", "Lupa", "Luta"] },
  "Le":  { boys: ["Lekhraj", "Lekhan", "Lesh"],                 girls: ["Lekha", "Leena", "Leela", "Lekhika"] },
  "Lo":  { boys: ["Lokesh", "Lokeshwara", "Loknath", "Lokaranjan"], girls: ["Lopa", "Lopamudra", "Lokpriya", "Lola"] },
  "A":   { boys: ["Aarav", "Arjun", "Akash", "Aditya", "Ansh", "Arnav", "Advit", "Aman"], girls: ["Aanya", "Ananya", "Aditi", "Anika", "Aaradhya", "Anushka", "Avni", "Aradhna"] },
  "I":   { boys: ["Ishaan", "Ishan", "Inder", "Indra", "Irshaad"], girls: ["Isha", "Indira", "Ishita", "Indrani", "Ishanvi"] },
  "U":   { boys: ["Uday", "Udit", "Uddhav", "Utkarsh", "Ujjwal"], girls: ["Uma", "Usha", "Urvi", "Ujjwala", "Unnati", "Upasna"] },
  "E":   { boys: ["Eshaan", "Eklavya", "Elan"],                 girls: ["Esha", "Ekta", "Eshwari", "Elakshi"] },
  "O":   { boys: ["Om", "Omkar", "Ojas", "Ojasvi"],             girls: ["Omvati", "Ojasvi"] },
  "Va":  { boys: ["Varun", "Vansh", "Vatsal", "Vatsalya", "Vaman"], girls: ["Vanya", "Vandana", "Vasudha", "Varsha", "Vaishnavi", "Vaidehi"] },
  "Vi":  { boys: ["Vijay", "Vikram", "Vishal", "Vivek", "Viraj", "Vihan", "Vinil"], girls: ["Vidya", "Vibha", "Vishakha", "Vimla", "Vinita", "Vibhavari", "Vishranti"] },
  "Vu":  { boys: ["Vushant", "Vuday"],                          girls: ["Vushna", "Vupali"] },
  "Ve":  { boys: ["Vedant", "Veer", "Venkat", "Venu"],          girls: ["Veda", "Vedika", "Veena", "Vegavati"] },
  "Vo":  { boys: ["Vohit", "Vohar"],                            girls: ["Vohini", "Vopika"] },
  "Ka":  { boys: ["Karan", "Kartik", "Kavish", "Kavi", "Kalyan", "Kamlesh", "Kamran"], girls: ["Kavya", "Kamya", "Kashvi", "Kamini", "Kalpana", "Kajal", "Kamala"] },
  "Ki":  { boys: ["Kiaan", "Kiran", "Kiran Kumar", "Kirtan", "Kishor"], girls: ["Kiara", "Kiran", "Kirra", "Kishori", "Kiran Bala"] },
  "Ku":  { boys: ["Kumar", "Kundan", "Kush", "Kuldeep", "Kunal"], girls: ["Kumari", "Kumud", "Kusuma", "Kuheli", "Kunika"] },
  "Gha": { boys: ["Ghanshyam", "Ghanshamdas"],                  girls: ["Ghazal", "Ghanavi"] },
  "Na":  { boys: ["Naman", "Naveen", "Naresh", "Nakul", "Nayan", "Narendra"], girls: ["Naina", "Nandini", "Natasha", "Namrata", "Navya", "Nandita", "Nalini"] },
  "Cha": { boys: ["Chandra", "Chandan", "Chaitan", "Chakresh", "Chanakya"], girls: ["Chandni", "Chandrika", "Champa", "Charvi", "Chaitali", "Chadrika"] },
  "Ke":  { boys: ["Keshav", "Kedar", "Kenil", "Ketan"],         girls: ["Keya", "Ketaki", "Keshavi", "Keshari"] },
  "Ko":  { boys: ["Komal", "Koman"],                            girls: ["Komal", "Kokila", "Komali"] },
  "Ha":  { boys: ["Harsh", "Hari", "Harshit", "Harshvardhan", "Hanuman", "Hardik"], girls: ["Hansa", "Harshita", "Harshal", "Hemi", "Hansi"] },
  "Hi":  { boys: ["Himanshu", "Hiren", "Himal"],               girls: ["Hima", "Hiral", "Himani", "Himanshi"] },
  "Hu":  { boys: ["Humanshu", "Husain"],                        girls: ["Huma", "Hupali"] },
  "He":  { boys: ["Hemant", "Hem", "Hemraj"],                   girls: ["Hema", "Hemali", "Hemangini"] },
  "Ho":  { boys: ["Homi"],                                      girls: ["Holi", "Hotaki"] },
  "Da":  { boys: ["Daksh", "Darshan", "Dav", "Dayashankar", "Darshit"], girls: ["Daya", "Damini", "Darshana", "Dakshina", "Damayanti"] },
  "Di":  { boys: ["Dixit", "Dinesh", "Divij", "Divyesh"],      girls: ["Diksha", "Divya", "Disha", "Dipti", "Divyanshi"] },
  "Du":  { boys: ["Dushyant", "Durga Prasad", "Durgesh"],       girls: ["Durga", "Durgavati", "Dulari"] },
  "De":  { boys: ["Dev", "Devesh", "Devraj", "Devansh"],        girls: ["Devika", "Devi", "Devyani", "Deepa", "Deepali"] },
  "Do":  { boys: ["Dolat", "Doyal"],                            girls: ["Dolly", "Dolna"] },
  "Ma":  { boys: ["Manav", "Mohit", "Mayank", "Manan", "Mahesh", "Manish", "Manoj"], girls: ["Maya", "Manvi", "Madhuri", "Mansi", "Mahima", "Malini", "Mandira"] },
  "Mi":  { boys: ["Milan", "Mihir", "Mitesh", "Mithun"],        girls: ["Mira", "Mitali", "Mihika", "Minal", "Minakshi"] },
  "Mu":  { boys: ["Mukesh", "Mukul", "Munish", "Murali"],       girls: ["Mugdha", "Mukta", "Mumtaz", "Murali Devi"] },
  "Me":  { boys: ["Mehul", "Meyank", "Medhav"],                 girls: ["Meera", "Meena", "Megha", "Menaka", "Meghna"] },
  "Mo":  { boys: ["Mohan", "Mohit", "Mohnish", "Monish"],       girls: ["Mohini", "Molina", "Monalisa", "Moli"] },
  "Ta":  { boys: ["Tarun", "Tanmay", "Tarandeep", "Tavish"],    girls: ["Tanya", "Tanvi", "Tanishka", "Tarini", "Tamanna"] },
  "Ti":  { boys: ["Tilak", "Tirth", "Tikam"],                   girls: ["Tina", "Tisha", "Tirtha", "Tiksha"] },
  "Tu":  { boys: ["Tushar", "Tuhin"],                           girls: ["Tulsi", "Tuhina", "Tushara"] },
  "Te":  { boys: ["Tej", "Tejas", "Tejpal", "Tejus"],           girls: ["Tejasvi", "Tejal", "Tejashri", "Teja"] },
  "To":  { boys: ["Toshan", "Tobar"],                           girls: ["Toshi", "Toshali"] },
  "Pa":  { boys: ["Parth", "Param", "Pavit", "Pavan", "Parikshit", "Paramveer"], girls: ["Priya", "Prachi", "Palak", "Pavitra", "Payal", "Parvati", "Padmini"] },
  "Pi":  { boys: ["Piyush", "Pinak"],                           girls: ["Pinky", "Pisha", "Pinkesh"] },
  "Pu":  { boys: ["Punit", "Purab", "Pushkar", "Purushottam"],  girls: ["Puja", "Purvi", "Pushpa", "Puloma"] },
  "Sha": { boys: ["Shashank", "Shantanu", "Shaurya", "Sharad", "Shashwat"], girls: ["Shanti", "Sharada", "Shalini", "Sharvari", "Shanaya", "Sharmila"] },
  "Tha": { boys: ["Tharun", "Thakur"],                          girls: ["Thara", "Thanga"] },
  "Pe":  { boys: ["Pehel", "Peeyush"],                          girls: ["Pearl", "Pehel"] },
  "Po":  { boys: ["Poojan", "Poshit"],                          girls: ["Pooja", "Poojita", "Poorna", "Poonam"] },
  "Ra":  { boys: ["Raj", "Rahul", "Ram", "Rajan", "Ravi", "Rajesh", "Rajat"], girls: ["Riya", "Radha", "Rani", "Rachna", "Radhika", "Rama", "Ranjana"] },
  "Ri":  { boys: ["Rishabh", "Rishit", "Ritesh", "Rishi", "Rinkesh"], girls: ["Ritu", "Ritika", "Riddhi", "Richa", "Rinki"] },
  "Ru":  { boys: ["Rudra", "Rupesh", "Ruchir"],                 girls: ["Ruchi", "Rupa", "Rupali", "Rukmini", "Ruchika"] },
  "Re":  { boys: ["Rekha Kumar", "Renu", "Reyansh"],            girls: ["Rekha", "Renu", "Reva", "Reena"] },
  "Ro":  { boys: ["Rohan", "Rohit", "Roshan"],                  girls: ["Rohini", "Roopa", "Rosheena"] },
  "Ye":  { boys: ["Yesh", "Yeshwant"],                          girls: ["Yeshi", "Yeshoda"] },
  "Yo":  { boys: ["Yogen", "Yogesh", "Yogi"],                   girls: ["Yogita", "Yogini", "Yojna"] },
  "Bha": { boys: ["Bharat", "Bhavin", "Bhavesh", "Bhanuprakash"], girls: ["Bharati", "Bhavana", "Bhavna", "Bhanumati"] },
  "Bhi": { boys: ["Bhishma", "Bhim"],                           girls: ["Bhiksha", "Bhilai"] },
  "Bhu": { boys: ["Bhuvan", "Bhupesh", "Bhupendra"],            girls: ["Bhumi", "Bhumika", "Bhuvaneshwari"] },
  "Dha": { boys: ["Dhruv", "Dheeraj", "Dhavak", "Dhairya"],     girls: ["Dharti", "Dhara", "Dhara Devi", "Dharini"] },
  "Be":  { boys: ["Benil", "Behram"],                           girls: ["Bella", "Bela", "Belinda"] },
  "Bo":  { boys: ["Bodhi", "Bodhisatva"],                       girls: ["Bohni", "Boshi"] },
  "Ja":  { boys: ["Jai", "Jayesh", "Jatin", "Jagdish", "Jagan", "Jaivardhan"], girls: ["Janvi", "Jaya", "Jayanti", "Jahnavi", "Jasmine", "Jagruthi"] },
  "Ji":  { boys: ["Jitesh", "Jigar", "Jitin", "Jivraj"],        girls: ["Jiya", "Jivika", "Jinisha"] },
  "Ju":  { boys: ["Jugal", "Justin"],                           girls: ["Jui", "Juhika"] },
  "Je":  { boys: ["Jevesh", "Jeman"],                           girls: ["Jeeva", "Jeevan"] },
  "Jo":  { boys: ["Joshi", "Jovin"],                            girls: ["Jolly", "Joshita"] },
  "Ga":  { boys: ["Ganesh", "Gaurav", "Gaurav Kumar", "Garv", "Gavin"], girls: ["Gauri", "Gaurika", "Gargi", "Gayatri", "Ganga"] },
  "Gi":  { boys: ["Girish", "Giriraj", "Gitesh"],               girls: ["Gita", "Giti", "Girija"] },
  "Gu":  { boys: ["Gulab", "Gurudev", "Gunesh", "Gurvinder"],   girls: ["Guni", "Gunjan", "Gul", "Gulab"] },
  "Ge":  { boys: ["Geetesh", "Gemal"],                          girls: ["Geeta", "Geetanjali", "Geeta Rani"] },
  "Go":  { boys: ["Gopesh", "Govind", "Gopal", "Gokulnath"],    girls: ["Gopi", "Gopika", "Gomati"] },
  "Sa":  { boys: ["Sagar", "Sahil", "Samar", "Sameer", "Sanket", "Sanjay", "Saransh"], girls: ["Sakshi", "Sara", "Saraswati", "Sanvi", "Saloni", "Samiksha", "Savitri"] },
  "Si":  { boys: ["Siddharth", "Siddh", "Sidhant"],             girls: ["Simran", "Sita", "Siddhi", "Siya", "Simona"] },
  "Su":  { boys: ["Suresh", "Suman", "Suraj", "Subhash", "Sunil", "Sushil"], girls: ["Sunita", "Suman", "Supriya", "Sushma", "Surabhi", "Sujata"] },
  "Se":  { boys: ["Sevak", "Sevan"],                            girls: ["Seema", "Seva"] },
  "So":  { boys: ["Soham", "Sohan", "Sohail"],                  girls: ["Sonal", "Sonam", "Soumya", "Sobha"] },
  "No":  { boys: ["Noman", "Nobel"],                            girls: ["Noor", "Nosheen"] },
  "Ya":  { boys: ["Yash", "Yatan", "Yatharth", "Yajnesh"],      girls: ["Yamini", "Yamuna", "Yashasvini", "Yasmin"] },
  "Yi":  { boys: ["Yinesh", "Yishu"],                           girls: ["Yosha", "Yima"] },
  "Yu":  { boys: ["Yuvan", "Yudhishtir", "Yuvraj", "Yusuf"],    girls: ["Yukta", "Yukti", "Yuvika", "Yuthika"] },
};

// Compute baby name suggestions from moon sidereal longitude
export interface BabyNameResult {
  nakshatra: string;
  pada: number;          // 1–4
  syllable: string;
  allSyllables: string[];
  boys: string[];
  girls: string[];
}

export function getBabyNames(moonSidLon: number): BabyNameResult {
  const NAKSHATRA_NAMES = Object.keys(NAKSHATRA_SYLLABLES);
  const nakshatraIndex  = Math.floor(moonSidLon / (360 / 27));
  const nakshatra       = NAKSHATRA_NAMES[Math.min(nakshatraIndex, 26)];
  const allSyllables    = NAKSHATRA_SYLLABLES[nakshatra] ?? ["A", "I", "U", "E"];
  const fractionInNak   = (moonSidLon % (360 / 27)) / (360 / 27);
  const padaIndex       = Math.min(Math.floor(fractionInNak * 4), 3); // 0-based
  const syllable        = allSyllables[padaIndex];
  const names           = SYLLABLE_NAMES[syllable] ?? { boys: [], girls: [] };

  return {
    nakshatra,
    pada:    padaIndex + 1,
    syllable,
    allSyllables: [...allSyllables],
    boys:    names.boys,
    girls:   names.girls,
  };
}
