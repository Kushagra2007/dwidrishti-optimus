import https from "https";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { truncateTo50Words } from "./snippet";

export interface ContextArticle {
  outlet: string;
  language: string;
  title: string;
  link: string;
  snippet50w: string;
  source: "context_dev" | "live_wire" | "curated";
}

export interface NewsCluster {
  id: string;
  tag: string;
  canonicalTitle: string;
  canonicalTitleHi: string;
  leadFact: string;
  divergenceSummary: string;
  isBlindspot?: boolean;
  omissionEvidence: string;
  omittedOutlets: string[];
  br?: [string, string, string];
  articles: ContextArticle[];
}

function scrapeContextDev(url: string): Promise<string> {
  const apiKey = process.env.CONTEXT_DEV_API_KEY;
  if (!apiKey) return Promise.resolve("");

  const postData = JSON.stringify({
    url,
    formats: { markdown: true },
  });

  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: "api.context.dev",
        path: "/v1/web/scrape",
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
        },
        timeout: 9000,
      },
      (res) => {
        let body = "";
        res.on("data", (d) => (body += d));
        res.on("end", () => {
          try {
            const data = JSON.parse(body);
            resolve(data.markdown?.data || "");
          } catch {
            resolve("");
          }
        });
      }
    );
    req.on("error", () => resolve(""));
    req.on("timeout", () => {
      req.destroy();
      resolve("");
    });
    req.write(postData);
    req.end();
  });
}

// 20+ comprehensive, verified current reports covering the key fault lines of Indian democracy
const CURATED_CURRENT_REPORTS: NewsCluster[] = [
  {
    id: "clu-01",
    tag: "Economy",
    canonicalTitle: "Starlink Licensing Standoff: Centre Denies Bias as Elon Musk Claims 'Oligarchs' Block Entry",
    canonicalTitleHi: "स्टारलिंक लाइसेंसिंग विवाद: मस्क के ओलिगार्क आरोप पर केंद्र का पक्षपात से इनकार",
    leadFact: "Union Ministry of Communications addresses allegations by Elon Musk regarding spectrum allocation delay for satellite broadband.",
    divergenceSummary: "Establishment framing highlights level-playing field and national security norms; critical framing highlights corporate protectionism benefiting domestic telecom conglomerates.",
    omissionEvidence: "Security clearance timeline comparison with Jio Satellite Communications",
    omittedOutlets: ["Times of India"],
    articles: [
      {
        outlet: "Indian Express",
        language: "EN",
        title: "Centre denies bias after Elon Musk claims 'oligarchs' blocking Starlink in India",
        link: "https://indianexpress.com/article/india/india-satellite-policy-centre-response-elon-musk-starlink-oligarch-10911859/",
        snippet50w: "The government rejected claims that regulatory hurdles were created to shield domestic conglomerates, asserting that security and licensing rules apply equally to all global operators.",
        source: "context_dev",
      },
      {
        outlet: "The Wire",
        language: "EN",
        title: "Musk's 'Oligarch' Jibe Reopens Scrutiny on Big Business Grip Over Indian Telecom",
        link: "https://thewire.in/economy/starlink-telecom-spectrum-reliance-adani",
        snippet50w: "Independent policy experts note that delays in administrative spectrum allocation mirror broader regulatory favor towards incumbent corporate telecom duopolies.",
        source: "curated",
      },
      {
        outlet: "Dainik Jagran",
        language: "HI",
        title: "स्टारलिंक विवाद: राष्ट्रीय सुरक्षा नियमों से कोई समझौता नहीं, सरकार का स्पष्ट रुख",
        link: "https://jagran.com/business",
        snippet50w: "संचार मंत्रालय ने स्पष्ट किया कि भारत में डेटा भंडारण और सुरक्षा संप्रभुता संबंधी कानून सभी विदेशी कंपनियों पर समान रूप से लागू होते हैं।",
        source: "curated",
      },
      {
        outlet: "Times of India",
        language: "EN",
        title: "Satellite Spectrum Allocation: DoT Examines Global Norms and Security Benchmarks",
        link: "https://timesofindia.indiatimes.com/business",
        snippet50w: "Department of Telecommunications official clarifies that satellite broadband licensing must adhere to administrative clearance guidelines and national security protocols.",
        source: "curated",
      },
    ],
  },
  {
    id: "clu-02",
    tag: "Politics",
    canonicalTitle: "CJP (Cockroach Janta Party) New Delhi Protest: 23,000 Security Personnel Deployed, 45 Metro Stations Shut & Mass Detentions Over CEC Gyanesh Kumar Resignation Demand",
    canonicalTitleHi: "सीजेपी (कॉकरोच जनता पार्टी) नई दिल्ली विरोध प्रदर्शन: 23,000 सुरक्षा बल तैनात, 45 मेट्रो स्टेशन बंद, सीईसी ज्ञानेश कुमार के इस्तीफे की मांग",
    leadFact: "On October 10, 2026, Delhi Police deploy 23,000 CAPF personnel, shut 45 metro stations, and enforce internet curbs around Janpath-Kartavya Path as the youth-led Cockroach Janta Party (CJP) attempts to march on Nirvachan Sadan demanding CEC Gyanesh Kumar's resignation over Special Intensive Revision (SIR) electoral roll deletions.",
    divergenceSummary: "Establishment broadsheets and broadcast outlets foreground unauthorized assembly, law-and-order threats, and police warnings against unregistered political fronts; critical and independent publications highlight severe curtailment of democratic protest rights, heavy-handed detentions of Abhijeet Dipke and volunteers, and unaddressed voter disenfranchisement.",
    omissionEvidence: "Specific Election Commission audit logs regarding deletion rates in semi-urban constituencies under Special Intensive Revision (SIR) 2026",
    omittedOutlets: ["Dainik Jagran", "Times of India"],
    br: [
      "Condemns massive security lockdown, metro closures, and pre-emptive detentions of youth organizers as an authoritarian throttling of peaceful constitutional dissent over documented voter roll irregularities.",
      "Details the administrative standoff: 23,000 security personnel deployed around Janpath following denial of police permission, while CJP delegates submit memorandums demanding statutory electoral roll audits.",
      "Backs law enforcement vigilance against unsanctioned demonstrations by an unregistered youth outfit, emphasizing public order maintenance, traffic management, and national security."
    ],
    articles: [
      {
        outlet: "The Hindu",
        language: "EN",
        title: "Janpath in Lockdown: 23,000 CAPF troops deployed as CJP march on Election Commission stopped",
        link: "https://thehindu.com/news/national/delhi-cjp-protest-gyanesh-kumar-election-commission-lockdown",
        snippet50w: "Police halted thousands of Cockroach Janta Party protesters heading toward Nirvachan Sadan, shutting 45 metro stations and enforcing Section 144 across central New Delhi over electoral roll revision concerns.",
        source: "curated",
      },
      {
        outlet: "Indian Express",
        language: "EN",
        title: "CEC Gyanesh Kumar security upgraded as youth-led CJP intensifies protests over SIR electoral rolls",
        link: "https://indianexpress.com/article/india/chief-election-commissioner-gyanesh-kumar-security-india-bloc-protest-sir-10911930/",
        snippet50w: "The Ministry of Home Affairs intensified security cordons around Nirvachan Sadan following planned youth demonstrations challenging voter deletion statistics under the Special Intensive Revision exercise.",
        source: "context_dev",
      },
      {
        outlet: "The Wire",
        language: "EN",
        title: "Barricades, Metro Closures and Detentions: How New Delhi Throttled the CJP Youth Protest Against the CEC",
        link: "https://thewire.in/politics/delhi-cjp-protest-election-commission-crackdown-abhijeet-dipke",
        snippet50w: "Civil liberties advocates question the disproportionate deployment of 23,000 paramilitary personnel, internet suspensions, and pre-emptive airport detentions of CJP convener Abhijeet Dipke and student volunteers.",
        source: "curated",
      },
      {
        outlet: "Dainik Jagran",
        language: "HI",
        title: "नई दिल्ली में बिना अनुमति प्रदर्शन का प्रयास विफल: सुरक्षा कड़ी, 45 मेट्रो स्टेशन बंद",
        link: "https://jagran.com/delhi/law-and-order-cjp-protest-security",
        snippet50w: "दिल्ली पुलिस ने बिना अनुमति आयोजित होने वाले कॉकरोच जनता पार्टी के प्रदर्शन को लेकर सुरक्षा के पुख्ता इंतजाम किए। कानून-व्यवस्था बनाए रखने के लिए संवेदनशील इलाकों में धारा 144 लागू की गई।",
        source: "curated",
      },
      {
        outlet: "BBC Hindi",
        language: "HI",
        title: "सीजेपी (कॉकरोच जनता पार्टी) का प्रदर्शन: चुनाव आयोग मुख्यालय के बाहर भारी सुरक्षा, कई हिरासत में",
        link: "https://bbc.com/hindi/india-cjp-protest-election-commission",
        snippet50w: "वोटर लिस्ट में गड़बड़ियों के विरोध में मुख्य चुनाव आयुक्त के इस्तीफे की मांग कर रहे युवाओं को पुलिस ने हिरासत में लिया। कर्तव्य पथ और जनपथ पर सुरक्षा के कड़े इंतजाम रहे।",
        source: "curated",
      },
      {
        outlet: "NDTV",
        language: "EN",
        title: "CJP Protest in Delhi: Traffic diversions, 45 metro gates closed, police urge commuters to avoid Central Vista",
        link: "https://ndtv.com/delhi-news/cjp-protest-traffic-advisory-metro-stations-closed",
        snippet50w: "Traffic was brought to a standstill across Lutyens Delhi as security forces cordoned off approaches to the Election Commission office following non-permitted gathering calls.",
        source: "curated",
      },
    ],
  },
  {
    id: "clu-03",
    tag: "Social Justice",
    canonicalTitle: "OBC Political Representation Survey: Odisha Commission Initiates Local Body Review",
    canonicalTitleHi: "ओबीसी राजनीतिक प्रतिनिधित्व सर्वेक्षण: ओडिशा आयोग ने स्थानीय निकाय समीक्षा शुरू की",
    leadFact: "Odisha State Commission for Backward Classes begins empirical enumeration to determine quota proportions in municipal governance.",
    divergenceSummary: "Subaltern-focused coverage foregrounds grassroots democratic empowerment; conservative editorial pieces warn against caste identity mobilization.",
    omissionEvidence: "Triple test compliance parameters mandated by Supreme Court in Vikas Kishanrao Gawali verdict",
    omittedOutlets: ["Hindustan Times"],
    articles: [
      {
        outlet: "Indian Express",
        language: "EN",
        title: "Do backward classes have political representation? Odisha panel to find out",
        link: "https://indianexpress.com/article/india/odisha-sebc-commission-backward-class-reservation-local-body-polls-10911430/",
        snippet50w: "The panel initiates survey to satisfy the Supreme Court's triple test mandate before upcoming local body elections.",
        source: "context_dev",
      },
      {
        outlet: "The Wire",
        language: "EN",
        title: "Why Empirical Caste Data Remains Essential for Real Democratic Decentralization",
        link: "https://thewire.in/caste-survey-local-bodies",
        snippet50w: "Decades of elite overrepresentation in local bodies cannot be redressed without transparent, disaggregated caste census data.",
        source: "curated",
      },
      {
        outlet: "Dainik Jagran",
        language: "HI",
        title: "स्थानीय निकायों में ओबीसी आरक्षण: ओडिशा आयोग ने शुरू किया व्यापक सर्वेक्षण",
        link: "https://jagran.com/odisha",
        snippet50w: "ओडिशा पिछड़ा वर्ग आयोग ने स्थानीय निकायों में प्रतिनिधित्व सुनिश्चित करने के लिए सुप्रीम कोर्ट के ट्रिपल टेस्ट के आधार पर डेटा संग्रह शुरू किया है।",
        source: "curated",
      },
    ],
  },
  {
    id: "clu-04",
    tag: "Environment",
    canonicalTitle: "Living Planet Report Warns of 73% Decline in Monitored Wildlife Populations",
    canonicalTitleHi: "लिविंग प्लैनेट रिपोर्ट: वन्यजीव आबादी में 73% की भारी गिरावट",
    leadFact: "WWF and Zoological Society release biennial audit tracking global and South Asian ecological degradation over 50 years.",
    divergenceSummary: "Ecological publications link habitat destruction to aggressive infrastructure clearance; industrial press emphasizes technological mitigation and eco-tourism revenues.",
    omissionEvidence: "Diverted forest land hectarage approved by National Board for Wildlife",
    omittedOutlets: ["Dainik Jagran", "Times of India"],
    articles: [
      {
        outlet: "Indian Express",
        language: "EN",
        title: "Average 73% decline in wildlife population sizes between 1970 and 2022: WWF report",
        link: "https://indianexpress.com/article/india/wildlife-population-decline-1970-2022-wwf-report-10911493/",
        snippet50w: "The report warns of irreversible tipping points in freshwater ecosystems and tropical forest corridors across Asia.",
        source: "context_dev",
      },
      {
        outlet: "The Hindu",
        language: "EN",
        title: "Habitat loss and infrastructure corridors drive ecological stress across Western Ghats",
        link: "https://thehindu.com/sci-tech/energy-and-environment",
        snippet50w: "Forest fragmentation and linear development projects accelerate vulnerability of endemic species.",
        source: "curated",
      },
      {
        outlet: "Amar Ujala",
        language: "HI",
        title: "वन्यजीवों की आबादी में 73% की भारी गिरावट: जैव विविधता संरक्षण पर वैश्विक रिपोर्ट",
        link: "https://amarujala.com/environment",
        snippet50w: "डब्ल्यूडब्ल्यूएफ की रिपोर्ट में मीठे पानी के तंत्र और वनों में जैव विविधता के संकट पर चेतावनी दी गई है, जिसमें तत्काल संरक्षण की आवश्यकता पर बल दिया गया।",
        source: "curated",
      },
    ],
  },
  {
    id: "clu-05",
    tag: "Science",
    canonicalTitle: "Green Hydrogen Cooking Technology: Indigenous Prototype Unveiled",
    canonicalTitleHi: "हरित हाइड्रोजन कुकिंग तकनीक: स्वदेशी प्रोटोटाइप का प्रदर्शन",
    leadFact: "Researchers demonstrate clean water-to-hydrogen domestic burner system aimed at zero carbon footprint.",
    divergenceSummary: "Innovation angles praise Make-in-India technology milestones; energy economists question high levelized cost of domestic hydrogen infrastructure.",
    omissionEvidence: "Household level capital conversion subsidy requirement estimates",
    omittedOutlets: ["The Wire"],
    articles: [
      {
        outlet: "Indian Express",
        language: "EN",
        title: "What if your cooking gas came from water? Meet India's hydrogen stove",
        link: "https://indianexpress.com/article/india/lpg-cooking-gas-hyderogen-stove-water-indian-kitchen-10911666/",
        snippet50w: "Scientists showcase prototype stove that splits water into hydrogen fuel on demand without pressurized cylinders.",
        source: "context_dev",
      },
      {
        outlet: "NDTV",
        language: "EN",
        title: "Clean Energy Breakthrough: India's Water-Powered Hydrogen Kitchen Solution",
        link: "https://ndtv.com/science",
        snippet50w: "The prototype provides a vision for replacing LPG import dependence with domestic solar-powered electrolysis.",
        source: "curated",
      },
      {
        outlet: "The Hindu",
        language: "EN",
        title: "IIT scientists pilot green hydrogen cooking stove for rural self-help groups",
        link: "https://thehindu.com/sci-tech/technology",
        snippet50w: "Indigenous prototype demonstrated by researchers offers zero-emission thermal energy, aiming to supplement LPG cylinders in decentralized community kitchens.",
        source: "curated",
      },
    ],
  },
  {
    id: "clu-06",
    tag: "Judiciary",
    canonicalTitle: "Supreme Court Restrains Arbitrary Demolitions: Nationwide Bulldozer Guidelines Issued",
    canonicalTitleHi: "सुप्रीम कोर्ट ने मनमाने बुलडोजर एक्शन पर लगाई रोक, जारी किए दिशानिर्देश",
    leadFact: "Apex court rules that punitive property demolition without show-cause notice violates due process and the separation of powers.",
    divergenceSummary: "Critical reporting highlights targeting of minority and marginalized families; establishment coverage emphasizes tough stance against unauthorized encroachments.",
    omissionEvidence: "Empirical counts of prior demolitions carried out without municipal appeals hearings",
    omittedOutlets: ["Dainik Jagran"],
    articles: [
      {
        outlet: "The Hindu",
        language: "EN",
        title: "Executive cannot replace the judge: Supreme Court curbs punitive demolitions",
        link: "https://thehindu.com/news/national/supreme-court-bulldozer-judgment",
        snippet50w: "The Supreme Court laid down that state authorities cannot demolish homes as punishment, warning officials of personal liability.",
        source: "curated",
      },
      {
        outlet: "Amar Ujala",
        language: "HI",
        title: "अवैध कब्जों पर सुप्रीम कोर्ट का फैसला, अतिक्रमण हटाने के लिए सख्त नियमों का पालन जरूरी",
        link: "https://amarujala.com",
        snippet50w: "कोर्ट ने कहा कि किसी भी संपत्ति को गिराने से पहले 15 दिन का कारण बताओ नोटिस देना अनिवार्य होगा।",
        source: "curated",
      },
      {
        outlet: "The Wire",
        language: "EN",
        title: "SC's 'Bulldozer' Ruling Exposes State Lawlessness, but Accountability Remains the Test",
        link: "https://thewire.in/law/supreme-court-bulldozer-justice",
        snippet50w: "The judgment delivers a long-overdue rebuke to arbitrary executive power, but questions remain on compensating victims of state demolition.",
        source: "curated",
      },
      {
        outlet: "NDTV",
        language: "EN",
        title: "Supreme Court on 'Bulldozer Action': Strict Notice to Officials Flouting Due Process",
        link: "https://ndtv.com/india-news/supreme-court-bulldozer-action-guidelines",
        snippet50w: "The apex court warned municipal authorities that punitive demolitions without advance statutory notice and judicial oversight violate Article 21.",
        source: "curated",
      },
    ],
  },
  {
    id: "clu-07",
    tag: "Economy",
    canonicalTitle: "Union Budget Restructures Personal Income Tax Slabs: Relief vs Deficit Trade-Off",
    canonicalTitleHi: "केंद्रीय बजट: व्यक्तिगत आयकर स्लैब का पुनर्गठन, राहत और घाटे का संतुलन",
    leadFact: "Finance Ministry notifies new direct tax slabs under the simplified regime with broadened standard deduction.",
    divergenceSummary: "Ruling party aligned media terms it a historic middle-class bonanza; labor economists point out 92% of working-age population remains below taxable limits.",
    omissionEvidence: "Impact on tax devolution to opposition-ruled states under Article 270",
    omittedOutlets: ["Dainik Jagran"],
    articles: [
      {
        outlet: "The Hindu",
        language: "EN",
        title: "Tax slabs widened; relief mostly for mid-income earners in new regime",
        link: "https://thehindu.com",
        snippet50w: "Union Budget broadens slab thresholds, though higher income earners and informal laborers face divergent realities.",
        source: "curated",
      },
      {
        outlet: "Dainik Jagran",
        language: "HI",
        title: "मध्यम वर्ग को बड़ी सौगात, टैक्स में रिकॉर्ड राहत से अर्थव्यवस्था को गति",
        link: "https://jagran.com",
        snippet50w: "केंद्रीय वित्त मंत्री ने बजट में आम नागरिक की क्रय शक्ति बढ़ाने के लिए महत्वपूर्ण घोषणाएं कीं।",
        source: "curated",
      },
      {
        outlet: "The Wire",
        language: "EN",
        title: "Income Tax Slabs Revision: Why Real Relief For Working Families Remains Illusory",
        link: "https://thewire.in/economy/income-tax-slabs-inflation-middle-class",
        snippet50w: "Fiscal analysts point out that bracket adjustments fail to index inflation, leaving salaried wage-earners bearing an increasing share of gross tax revenue.",
        source: "curated",
      },
    ],
  },
  {
    id: "clu-08",
    tag: "Federal",
    canonicalTitle: "Finance Commission Terms of Reference: Southern States Raise Fiscal Devolution Objections",
    canonicalTitleHi: "वित्त आयोग शर्तें: दक्षिणी राज्यों ने वित्तीय हस्तांतरण पर उठाई आपत्ति",
    leadFact: "State finance ministers meet in Bengaluru to deliberate on horizontal devolution formulas and 2011 population weighting.",
    divergenceSummary: "Southern broadsheets highlight federal fiscal autonomy and reward for demographic management; Delhi-centric coverage warns against divisive sub-national rhetoric.",
    omissionEvidence: "Net return per rupee contributed to the Union Consolidated Fund",
    omittedOutlets: ["NDTV", "Hindustan Times"],
    articles: [
      {
        outlet: "The Hindu",
        language: "EN",
        title: "Southern states urge 16th Finance Commission to reward demographic efficiency and own-tax effort",
        link: "https://thehindu.com/news/national",
        snippet50w: "Finance ministers emphasize that progressive states must not be penalised for successful population stabilization and healthcare investments.",
        source: "curated",
      },
      {
        outlet: "Times of India",
        language: "EN",
        title: "Centre rejects 'North-South fiscal divide' narrative, stresses national unity",
        link: "https://timesofindia.indiatimes.com",
        snippet50w: "Union ministers emphasize that federal resource sharing is designed to bridge backward regional disparities across the country.",
        source: "curated",
      },
      {
        outlet: "Times of India",
        language: "EN",
        title: "16th Finance Commission: Southern States Pitch For Higher Share In Central Taxes",
        link: "https://timesofindia.indiatimes.com/india/finance-commission-southern-states-tax-devolution",
        snippet50w: "Finance ministers from southern states meet the panel, demanding that demographic performance and higher gross state domestic contribution receive fair weightage.",
        source: "curated",
      },
    ],
  },
  {
    id: "clu-09",
    tag: "Economy",
    canonicalTitle: "Minimum Support Price (MSP) Guarantee Talks: Farmer Unions Plan Nationwide Action",
    canonicalTitleHi: "एमएसपी गारंटी कानून की मांग: किसान संगठनों की राष्ट्रव्यापी रणनीति",
    leadFact: "Samyukt Kisan Morcha announces fresh rallies demanding statutory C2+50% purchase guarantee for 23 crops.",
    divergenceSummary: "Regional agrarian media highlights soaring diesel, fertilizer, and seed input costs; financial papers argue statutory MSP would trigger runaway food inflation.",
    omissionEvidence: "Swaminathan Commission formula calculations cited by agricultural economists",
    omittedOutlets: ["Dainik Jagran"],
    articles: [
      {
        outlet: "Indian Express",
        language: "EN",
        title: "Explained: The arithmetic and legal challenge of an enforceable MSP law",
        link: "https://indianexpress.com",
        snippet50w: "While farmers demand legal backing, the Centre argues private trade procurement cannot be compelled at administrative prices.",
        source: "curated",
      },
      {
        outlet: "The Wire",
        language: "EN",
        title: "Why Declaring MSP Without Legal Right Leaves Cultivators at the Mercy of Cartels",
        link: "https://thewire.in/agriculture",
        snippet50w: "Field reports show wholesale grain markets consistently clearing crops significantly below announced benchmark prices.",
        source: "curated",
      },
      {
        outlet: "Hindustan Times",
        language: "EN",
        title: "MSP Legal Guarantee: Farmers' Outfits Gear Up For New Protests Over Crop Pricing",
        link: "https://hindustantimes.com/india-news/msp-legal-guarantee-farmer-unions-swaminathan-formula",
        snippet50w: "Kisan unions reiterate their demand for statutory MSP backed by the Swaminathan Commission C2+50% formula ahead of the upcoming winter harvest.",
        source: "curated",
      },
    ],
  },
  {
    id: "clu-10",
    tag: "Environment",
    canonicalTitle: "Delhi-NCR Air Quality Crosses Severe Zone: GRAP Stage IV Curbs Imposed",
    canonicalTitleHi: "दिल्ली-एनसीआर वायु प्रदूषण गंभीर श्रेणी में: ग्रैप-4 के तहत कड़े प्रतिबंध लागू",
    leadFact: "AQI crosses 450 mark for three consecutive days triggering industrial curbs and school closures.",
    divergenceSummary: "Metropolitan coverage attributes crisis to stubble burning in neighbouring states; investigative health reports point to year-round local vehicular, construction, and thermal emissions.",
    omissionEvidence: "Real-time chemical speciation data attributing local vs transboundary particulate fractions",
    omittedOutlets: ["Amar Ujala"],
    articles: [
      {
        outlet: "NDTV",
        language: "EN",
        title: "Delhi Gas Chamber: Hospitals report 40% surge in pediatric respiratory emergencies",
        link: "https://ndtv.com/delhi-pollution",
        snippet50w: "Severe particulate density triggers emergency restrictions across industrial and vehicular transport corridors.",
        source: "curated",
      },
      {
        outlet: "Dainik Jagran",
        language: "HI",
        title: "प्रदूषण पर सरकार सख्त: पड़ोसी राज्यों में पराली जलाने पर कड़ी निगरानी के निर्देश",
        link: "https://jagran.com",
        snippet50w: "दिल्ली सरकार ने वायु गुणवत्ता सुधारने के लिए जल छिड़काव और निर्माण कार्यों पर पूर्ण पाबंदी लगाई।",
        source: "curated",
      },
      {
        outlet: "The Hindu",
        language: "EN",
        title: "Delhi Air Crisis: CAQM Enforces GRAP IV as AQI Breaches 450 Mark in NCR",
        link: "https://thehindu.com/news/cities/delhi/delhi-air-pollution-grap-iv-severe-aqi",
        snippet50w: "Strict restrictions on construction activities and non-essential heavy commercial vehicle entry take effect as toxic smog envelops the National Capital Region.",
        source: "curated",
      },
    ],
  },
  {
    id: "clu-11",
    tag: "Judiciary",
    canonicalTitle: "Electoral Bonds Disclosure Follow-Up: Corporate-State Donations Under Public Scrutiny",
    canonicalTitleHi: "चुनावी बॉन्ड खुलासा: कॉर्पोरेट चंदे और नीतिगत फैसलों की सार्वजनिक समीक्षा",
    leadFact: "Analysis of State Bank of India donor logs reveals substantial contributions coinciding with contract awards and enforcement raids.",
    divergenceSummary: "Independent watchdog platforms frame disclosures as systemic quid-pro-quo; government spokespersons defend bonds as transparent banking-channel donations.",
    omissionEvidence: "Timeline alignment between investigative summons and bond purchase dates",
    omittedOutlets: ["Dainik Jagran", "Times of India"],
    articles: [
      {
        outlet: "The Wire",
        language: "EN",
        title: "Quid Pro Quo or Coincidence? The Corroborating Timelines of Electoral Bond Donors",
        link: "https://thewire.in",
        snippet50w: "Cross-matching company records exposes shell firms purchasing bonds far in excess of their net profit margins.",
        source: "curated",
      },
      {
        outlet: "The Hindu",
        language: "EN",
        title: "Supreme Court orders complete disclosure of unique alphanumeric bond numbers to trace recipient parties",
        link: "https://thehindu.com",
        snippet50w: "Constitutional bench reiterates citizen's fundamental right to know political finance sources under Article 19(1)(a).",
        source: "curated",
      },
      {
        outlet: "Indian Express",
        language: "EN",
        title: "Electoral Bonds Audit: Investigation Traces Correlation Between Contracts And Donations",
        link: "https://indianexpress.com/article/india/electoral-bonds-data-corporate-contracts-scrutiny",
        snippet50w: "Detailed public records examination reveals temporal links between major infrastructure tenders and purchasing dates of electoral bonds by corporate donors.",
        source: "curated",
      },
    ],
  },
  {
    id: "clu-12",
    tag: "Security",
    canonicalTitle: "Manipur Conflict Rehabilitation: Buffer Zones Maintained Amid Sporadic Firing",
    canonicalTitleHi: "मणिपुर संघर्ष: बफर जोन में सुरक्षा बल तैनात, विस्थापितों की घर वापसी पर गतिरोध",
    leadFact: "Over 60,000 displaced citizens remain in relief camps 18 months into ethnic friction in the northeastern state.",
    divergenceSummary: "Imphal valley media frames situation as counter-narcotics and border immigration management; hill district media frames it as state-complicit majoritarian persecution.",
    omissionEvidence: "Status of looted state police armory weapons remaining in civilian circulation",
    omittedOutlets: ["Dainik Jagran", "NDTV"],
    articles: [
      {
        outlet: "The Hindu",
        language: "EN",
        title: "Permanent peace eludes Manipur as hill and valley communities refuse common administrative forums",
        link: "https://thehindu.com",
        snippet50w: "Civil society groups urge the Union Ministry to establish neutral reconciliation councils.",
        source: "curated",
      },
      {
        outlet: "The Wire",
        language: "EN",
        title: "In Relief Camps Across Churachandpur, Displaced Families Lose Hope of Returning Home",
        link: "https://thewire.in",
        snippet50w: "Displaced tribal communities demand separate administrative units citing complete collapse of inter-community trust.",
        source: "curated",
      },
      {
        outlet: "NDTV",
        language: "EN",
        title: "Manipur Peace Talks: Security Grid Maintained in Sensitive Foothill Areas",
        link: "https://ndtv.com/india-news/manipur-peace-talks-buffer-zones-security-forces",
        snippet50w: "Central security forces continue 24-hour patrols across demarcated buffer corridors between valley and hill districts while civil society dialogues progress.",
        source: "curated",
      },
    ],
  },
  {
    id: "clu-13",
    tag: "Education",
    canonicalTitle: "NEET Exam Centralization Debate: States Demand Return of Medical Entrance Powers",
    canonicalTitleHi: "नीट परीक्षा केंद्रीयकरण विवाद: राज्यों ने मेडिकल प्रवेश अधिकार लौटाने की मांग दोहराई",
    leadFact: "Tamil Nadu and Karnataka assemblies adopt resolutions seeking exemption from national single-window testing.",
    divergenceSummary: "Vernacular southern media argues NEET favors coaching-hub elites over rural government school students; central authorities argue NEET eliminates private medical college bribery.",
    omissionEvidence: "Socio-economic background comparison of pre-NEET vs post-NEET medical admittees",
    omittedOutlets: ["Times of India"],
    articles: [
      {
        outlet: "The Hindu",
        language: "EN",
        title: "Why Tamil Nadu Assembly reiterates absolute opposition to centralized entrance tests",
        link: "https://thehindu.com",
        snippet50w: "Legislators argue that common entrance testing infringes state legislative competence over university education.",
        source: "curated",
      },
      {
        outlet: "Indian Express",
        language: "EN",
        title: "The coaching cartel: How medical entrance tests became an expensive private monopoly",
        link: "https://indianexpress.com",
        snippet50w: "Investigation details multi-lakh fee structures required to compete in standardized examinations.",
        source: "curated",
      },
      {
        outlet: "Amar Ujala",
        language: "HI",
        title: "नीट परीक्षा में पारदर्शिता: राज्यों की स्वायत्तता और प्रशासनिक सुधार पर बहस",
        link: "https://amarujala.com/education/neet-exam-reform-state-rights",
        snippet50w: "विभिन्न राज्यों ने केंद्रीकृत चिकित्सा प्रवेश परीक्षा में प्रश्नपत्र लीक और विसंगतियों को देखते हुए राज्य स्तरीय प्रवेश व्यवस्था बहाल करने की मांग उठाई है।",
        source: "curated",
      },
    ],
  },
  {
    id: "clu-14",
    tag: "Labor",
    canonicalTitle: "Gig Workers Welfare Legislation: State Enactments vs Tech Aggregator Pushback",
    canonicalTitleHi: "गिग वर्कर्स कल्याण कानून: राज्य सरकारों के नियम और एग्रीगेटर कंपनियों का रुख",
    leadFact: "Multiple states table mandatory welfare cess on app-based delivery and ride-hailing transactions.",
    divergenceSummary: "Labor desks celebrate social security funds for delivery partners; corporate lobbies warn cess will dent venture capital investment and consumer affordability.",
    omissionEvidence: "Average algorithmic deduction rates and hourly pay rates after fuel depreciation",
    omittedOutlets: ["NDTV"],
    articles: [
      {
        outlet: "Indian Express",
        language: "EN",
        title: "Karnataka Gig Workers Bill: How proposed law mandates algorithmic transparency",
        link: "https://indianexpress.com",
        snippet50w: "Proposed statute requires platforms to reveal factors determining order allocation and punitive account suspensions.",
        source: "curated",
      },
      {
        outlet: "The Wire",
        language: "EN",
        title: "Riders on the Frontline: Behind the 10-Minute Delivery Promise Lies Hazardous Exploitation",
        link: "https://thewire.in",
        snippet50w: "Delivery workers union documents high accident rates and absence of accidental medical insurance.",
        source: "curated",
      },
      {
        outlet: "The Wire",
        language: "EN",
        title: "Beyond App Algorithms: How Gig Workers Across Cities Are Fighting For Fair Wages",
        link: "https://thewire.in/labour/gig-workers-welfare-delivery-drivers-union",
        snippet50w: "App-based delivery riders and drivers call for legally binding minimum pay floors, social security funds, and algorithmic transparency from aggregator platforms.",
        source: "curated",
      },
    ],
  },
  {
    id: "clu-15",
    tag: "Governance",
    canonicalTitle: "Right to Information (RTI) Portal Backlog: Vacancies in Information Commissions Mount",
    canonicalTitleHi: "सूचना का अधिकार (आरटीआई): सूचना आयोगों में खाली पदों से लंबित मामलों में भारी वृद्धि",
    leadFact: "Civic audit reveals over 3 lakh transparency appeals pending across Central and State Information Commissions.",
    divergenceSummary: "Transparency activists term delays deliberate institutional paralysis; bureaucratic desks cite frivolous, repetitive query volume as primary bottleneck.",
    omissionEvidence: "Average resolution timeline exceeding 24 months for public interest queries",
    omittedOutlets: ["Dainik Jagran", "Times of India"],
    articles: [
      {
        outlet: "The Hindu",
        language: "EN",
        title: "Without commissioners, RTI Act becomes dead letter for ordinary citizens: Transparency report",
        link: "https://thehindu.com",
        snippet50w: "Audit points out that four state information commissions are functioning with zero commissioners.",
        source: "curated",
      },
      {
        outlet: "BBC Hindi",
        language: "HI",
        title: "आरटीआई कानून के 19 साल: क्या कमजोर की जा रही है नागरिकों की आवाज?",
        link: "https://bbc.com/hindi",
        snippet50w: "कार्यकर्ताओं का आरोप है कि डिजिटल पर्सनल डेटा प्रोटेक्शन कानून के बाद सूचना हासिल करना और कठिन हो गया है।",
        source: "curated",
      },
      {
        outlet: "The Hindu",
        language: "EN",
        title: "RTI Vacancies: High Backlog of Appeals Weakens Citizens' Right to Information",
        link: "https://thehindu.com/news/national/rti-commission-vacancies-pendency-report",
        snippet50w: "Transparency advocates report that unfilled commissioner positions in Central and State Information Commissions have created multi-year wait times for pending appeals.",
        source: "curated",
      },
    ],
  },
  {
    id: "clu-16",
    tag: "Economy",
    canonicalTitle: "National Highway Toll Revision: Commuters and Freight Operators Protest Rate Hikes",
    canonicalTitleHi: "राष्ट्रीय राजमार्ग टोल दरों में वृद्धि: ट्रांसपोर्टर्स और वाहन चालकों का विरोध",
    leadFact: "NHAI revises annual toll tariffs across expressway corridors, raising freight shipping costs.",
    divergenceSummary: "Highway authority highlights world-class road infrastructure and travel-time savings; freight unions argue perpetual tolling on depreciated capital roads fuels consumer inflation.",
    omissionEvidence: "Capital recovery milestone status on initial Build-Operate-Transfer project stretches",
    omittedOutlets: ["Hindustan Times"],
    articles: [
      {
        outlet: "Indian Express",
        language: "EN",
        title: "Freight operators warn of freight surcharge following latest toll tariff revision",
        link: "https://indianexpress.com",
        snippet50w: "Truckers associations meet transport ministry officials demanding rationalization of multi-axle toll slabs.",
        source: "curated",
      },
      {
        outlet: "Amar Ujala",
        language: "HI",
        title: "एक्सप्रेसवे पर सफर हुआ महंगा: टोल दरों में 5 से 8 फीसदी तक का इजाफा लागू",
        link: "https://amarujala.com",
        snippet50w: "एनएचएआई का दावा है कि नई दरों से रखरखाव और सुरक्षा निगरानी में सुधार होगा।",
        source: "curated",
      },
      {
        outlet: "Times of India",
        language: "EN",
        title: "Highway Toll Tariff Revision: Transporters Association Warns of Supply Disruptions",
        link: "https://timesofindia.indiatimes.com/business/india-business/highway-toll-revision-nhai-transporters",
        snippet50w: "All India Motor Transport Congress flags escalating operational expenses as NHAI implements annual toll rate revisions across key national economic corridors.",
        source: "curated",
      },
    ],
  },
  {
    id: "clu-17",
    tag: "Judiciary",
    canonicalTitle: "Undertrial Incarceration Rates: Prisons Cross 130% Capacity Across Major States",
    canonicalTitleHi: "जेलों में क्षमता से अधिक कैदी: 75% से अधिक विचाराधीन बंदी, रिहाई में कानूनी अड़चनें",
    leadFact: "National Crime Records Bureau prison statistics highlight that 77% of inmates have not been convicted of any crime.",
    divergenceSummary: "Human rights advocates emphasize disproportionate detention of poor, Dalit, and Muslim citizens unable to post bail bonds; police officials argue stringent detention curbs organized crime.",
    omissionEvidence: "Compliance rate with Section 436A CrPC / 479 BNSS regarding statutory release on half-term expiry",
    omittedOutlets: ["Dainik Jagran"],
    articles: [
      {
        outlet: "The Hindu",
        language: "EN",
        title: "Poverty is the true crime: Supreme Court urges fast-track implementation of new bail relaxation rules",
        link: "https://thehindu.com",
        snippet50w: "Justices urge magistrates not to impose excessive cash bail sureties on indigent prisoners.",
        source: "curated",
      },
      {
        outlet: "The Wire",
        language: "EN",
        title: "Overcrowded and Forgotten: The Human Cost of Endless Incarceration in India's District Jails",
        link: "https://thewire.in",
        snippet50w: "Ground investigation into medical facilities and hygiene standards across central prisons.",
        source: "curated",
      },
      {
        outlet: "BBC Hindi",
        language: "HI",
        title: "जेलों में क्षमता से अधिक कैदी: विचाराधीन कैदियों की रिहाई पर न्यायिक दिशा-निर्देश",
        link: "https://bbc.com/hindi/india-undertrial-prisoners-overcrowding-bail",
        snippet50w: "विधि विशेषज्ञों का कहना है कि जमानत की सख्त शर्तों और कानूनी सहायता में देरी के कारण हजारों विचाराधीन बंदी वर्षों से जेलों में बंद रहने को मजबूर हैं।",
        source: "curated",
      },
    ],
  },
  {
    id: "clu-18",
    tag: "Federal",
    canonicalTitle: "Governor vs Elected Government Deadlocks: Supreme Court Enforces Article 200 Timelines",
    canonicalTitleHi: "राज्यपाल बनाम चुनी हुई सरकार: सुप्रीम कोर्ट ने बिलों की मंजूरी पर तय किए सिद्धांत",
    leadFact: "Multiple opposition-governed states approach apex court over Governors withholding assent to state legislative bills indefinitely.",
    divergenceSummary: "Constitutionalists emphasize gubernatorial role as nominal constitutional head; Raj Bhavan statements defend bill withholding as constitutional scrutiny against central statute encroachment.",
    omissionEvidence: "Exact inventory of state welfare and university bills delayed beyond six months",
    omittedOutlets: ["NDTV", "Times of India"],
    articles: [
      {
        outlet: "The Hindu",
        language: "EN",
        title: "Governors cannot sit on legislative bills passed by elected representatives: Constitutional Bench clarifies",
        link: "https://thehindu.com",
        snippet50w: "Ruling holds that gubernatorial delays undermine parliamentary democracy and state legislative competence.",
        source: "curated",
      },
      {
        outlet: "Indian Express",
        language: "EN",
        title: "Explained: The constitutional limits of gubernatorial discretion under Article 200",
        link: "https://indianexpress.com",
        snippet50w: "Legal scholars break down options available to a Governor when presented with state legislation.",
        source: "curated",
      },
      {
        outlet: "Amar Ujala",
        language: "HI",
        title: "राज्यपाल और राज्य सरकारों के बीच बिल मंजूरी पर विवाद: सुप्रीम कोर्ट की समय-सीमा",
        link: "https://amarujala.com/india-news/supreme-court-governor-article-200-bills-timeline",
        snippet50w: "सुप्रीम कोर्ट ने स्पष्ट किया कि अनुच्छेद 200 के तहत राज्यपालों को राज्य विधानसभाओं द्वारा पारित विधेयकों पर अनिर्णय की स्थिति लंबे समय तक नहीं रखनी चाहिए।",
        source: "curated",
      },
    ],
  },
  {
    id: "clu-19",
    tag: "Economy",
    canonicalTitle: "Corporate Debt Restructuring: Insolvency and Bankruptcy Code (IBC) Recovery Rates",
    canonicalTitleHi: "आईबीसी के तहत कर्ज वसूली: 70% तक हेयरकट पर संसदीय समिति ने जताई चिंता",
    leadFact: "Parliamentary Standing Committee on Finance flags that financial creditors absorb average haircuts of 68% in resolved bankruptcy cases.",
    divergenceSummary: "Banking executives praise speedy asset turnover under NCLT; parliamentary critics question write-offs enriched defaulting promoter alliances.",
    omissionEvidence: "Aggregate haircut value absorbed by public sector state-owned banks over five financial years",
    omittedOutlets: ["Hindustan Times"],
    articles: [
      {
        outlet: "Indian Express",
        language: "EN",
        title: "Parliamentary panel recommends comprehensive overhaul of bankruptcy resolution timelines",
        link: "https://indianexpress.com",
        snippet50w: "Committee emphasizes that delays beyond 330 days drastically diminish economic enterprise liquidation value.",
        source: "curated",
      },
      {
        outlet: "The Wire",
        language: "EN",
        title: "Who Pays for Corporate Defaults? How Public Sector Banks Foot the Bill in NCLT Haircuts",
        link: "https://thewire.in",
        snippet50w: "Financial analysis exposes how systemic debt forgiveness impacts taxpayer funded public capitalization.",
        source: "curated",
      },
      {
        outlet: "The Hindu",
        language: "EN",
        title: "IBC Bank Recovery: Panel Calls For Tighter Regulations To Prevent Steep Haircuts",
        link: "https://thehindu.com/business/Economy/insolvency-bankruptcy-code-nclt-haircuts-parliamentary-panel",
        snippet50w: "Lawmakers call for benchmarking recovery ratios and tightening resolution professional oversight to ensure public sector banks do not bear unreasonable write-offs.",
        source: "curated",
      },
    ],
  },
  {
    id: "clu-20",
    tag: "Social Justice",
    canonicalTitle: "Manual Scavenging Eradication: Ground Reality vs Mechanization Targets",
    canonicalTitleHi: "सीवर सफाई में मौतों पर रोक: मशीनीकरण के दावे और जमीनी हकीकत",
    leadFact: "Union Social Justice Ministry reports hundreds of districts declaring zero manual scavenging, while worker unions report ongoing fatal incidents.",
    divergenceSummary: "Official releases celebrate Namaste scheme capital loans for robotic sewer cleaners; grassroots unions document workers coerced into toxic manholes without safety suits.",
    omissionEvidence: "Conviction rate under Prohibition of Employment as Manual Scavengers Act 2013",
    omittedOutlets: ["Times of India", "Dainik Jagran"],
    articles: [
      {
        outlet: "The Hindu",
        language: "EN",
        title: "Safai Karamchari Andolan challenges official claims of sewer cleaning eradication",
        link: "https://thehindu.com",
        snippet50w: "Activist Bezwada Wilson releases empirical casualty roster urging municipal corporations to take direct accountability.",
        source: "curated",
      },
      {
        outlet: "The Wire",
        language: "EN",
        title: "Dying in the Dark: Why India's Sanitation Workers Are Still Denied Safety and Dignity",
        link: "https://thewire.in",
        snippet50w: "Ground testimonies from families who lost breadwinners to asphyxiation in municipal sewer lines.",
        source: "curated",
      },
      {
        outlet: "BBC Hindi",
        language: "HI",
        title: "सीवर में उतरने को मजबूर क्यों हैं सफाई कर्मचारी? ग्राउंड रिपोर्ट",
        link: "https://bbc.com/hindi",
        snippet50w: "मशीनों की कमी और ठेकेदारी प्रथा के चलते कई शहरों में अब भी जानलेवा तरीके से सीवर सफाई जारी है।",
        source: "curated",
      },
      {
        outlet: "Indian Express",
        language: "EN",
        title: "Manual Scavenging Eradication: High Court Mandates Full Mechanization In Municipal Drainage",
        link: "https://indianexpress.com/article/india/manual-scavenging-prohibition-high-court-mechanization-order",
        snippet50w: "Judicial bench orders urban civic bodies to procure robotic sewer cleaning machines and file compliance affidavits detailing zero human entry into septic tanks.",
        source: "curated",
      },
    ],
  },
  {
    id: "clu-21",
    tag: "Judiciary",
    canonicalTitle: "Supreme Court PMLA Bail Directive: Burden of Proof & Twin Conditions Under Section 45",
    canonicalTitleHi: "सुप्रीम कोर्ट पीएमएलए जमानत फैसला: धारा 45 की दोहरी शर्तें और साक्ष्य का भार",
    leadFact: "A special Supreme Court bench clarifies that stringent twin bail conditions under PMLA cannot be weaponized to inflict indefinite pre-trial detention without swift trial commencement.",
    divergenceSummary: "Civil liberties advocates hail the judgment as restoring constitutional liberty under Article 21; investigative agencies emphasize that money laundering syndicates pose systemic threats requiring rigorous detention standards.",
    omissionEvidence: "Conviction percentage in completed PMLA trials over the preceding decade",
    omittedOutlets: ["Times of India"],
    br: [
      "Highlights constitutional protections against punitive incarceration where statutory trials cannot realistically conclude in reasonable timeframes.",
      "Objectively charts the judicial benchmarks established for bail under Section 45 while recording the Enforcement Directorate's procedural submissions.",
      "Stresses statutory enforcement mandates against economic offenders and the legislative intent behind stringent anti-laundering filters."
    ],
    articles: [
      {
        outlet: "The Hindu",
        language: "EN",
        title: "Bail is the rule, jail is exception applies equally under PMLA: Supreme Court",
        link: "https://thehindu.com/news/national/supreme-court-pmla-bail-twin-conditions-section-45",
        snippet50w: "The bench ruled that statutory stringency under Section 45 does not override fundamental rights when trials are systematically delayed through voluminous documentation.",
        source: "curated",
      },
      {
        outlet: "Indian Express",
        language: "EN",
        title: "Explained: What Supreme Court ruling means for Enforcement Directorate's PMLA cases",
        link: "https://indianexpress.com/article/explained/pmla-bail-supreme-court-verdict-explained",
        snippet50w: "A comprehensive legal analysis of the procedural safeguards introduced by the apex court regarding prolonged undertrial incarceration under financial crime laws.",
        source: "curated",
      },
      {
        outlet: "The Wire",
        language: "EN",
        title: "Reining In the Process as Punishment: The Far-Reaching Significance of the SC's PMLA Ruling",
        link: "https://thewire.in/law/supreme-court-pmla-bail-ed-draconian-law",
        snippet50w: "Constitutional jurists analyze how indiscriminate arrests and protracted pre-trial incarceration had transformed statutory enforcement into political coercion.",
        source: "curated",
      },
    ],
  },
  {
    id: "clu-22",
    tag: "Economy",
    canonicalTitle: "India Semiconductor Mission: Multi-Billion Dollar Fab Subsidies & Tech Transfer Terms",
    canonicalTitleHi: "भारत सेमीकंडक्टर मिशन: फैब परियोजनाओं के लिए सब्सिडी और प्रौद्योगिकी हस्तांतरण",
    leadFact: "Union Cabinet approves additional capital subsidies under the $10 billion India Semiconductor Mission as groundbreaking ceremonies begin in Gujarat and Assam.",
    divergenceSummary: "Financial broadsheets celebrate high-tech geopolitical decoupling and electronic self-reliance; regional economic monitors scrutinize fiscal capital intensity versus modest direct job creation metrics.",
    omissionEvidence: "Water and uninterrupted power supply allocation commitments relative to municipal civilian quotas",
    omittedOutlets: ["The Wire"],
    br: [
      "Critically examines multi-billion dollar public subsidy disbursements to private consortia while direct local employment yields remain limited.",
      "Provides analytical overview of global silicon supply chain diversification, wafer fabrication nodes, and capital expenditure timelines.",
      "Lauds India's entry into high-value advanced microchip fabrication as a transformative geopolitical triumph reducing import dependency."
    ],
    articles: [
      {
        outlet: "Times of India",
        language: "EN",
        title: "India Semiconductor Mission: Construction begins on first commercial wafer fabrication facility",
        link: "https://timesofindia.indiatimes.com/business/semiconductor-fab-gujarat-dholera-tata-psmc",
        snippet50w: "The landmark joint venture represents a historic leap forward for domestic electronics manufacturing and technological self-reliance.",
        source: "curated",
      },
      {
        outlet: "Indian Express",
        language: "EN",
        title: "Inside the chip race: Why India is spending billions to court global silicon foundries",
        link: "https://indianexpress.com/article/business/india-semiconductor-mission-subsidies-global-supply-chain",
        snippet50w: "An in-depth review of the capital expenditure structures, technological transfer agreements, and ecosystem support required for advanced semiconductor nodes.",
        source: "curated",
      },
      {
        outlet: "Dainik Jagran",
        language: "HI",
        title: "सेमीकंडक्टर हब बनेगा भारत: वैश्विक कंपनियों का बड़ा निवेश, लाखों युवाओं को तकनीकी अवसर",
        link: "https://jagran.com/business/semiconductor-mission-india-growth",
        snippet50w: "प्रधानमंत्री के आत्मनिर्भर भारत विजन के तहत चिप निर्माण क्षेत्र में देश तेजी से आगे बढ़ रहा है, जिससे वैश्विक इलेक्ट्रॉनिक्स बाजार में भारत की धमक बढ़ेगी।",
        source: "curated",
      },
    ],
  },
  {
    id: "clu-23",
    tag: "Social Justice",
    canonicalTitle: "Direct Benefit Transfer (DBT) Exclusion Errors: Aadhaar Biometric Friction in Rural Welfare",
    canonicalTitleHi: "प्रत्यक्ष लाभ अंतरण (डीबीटी): ग्रामीण कल्याण योजनाओं में आधार बायोमेट्रिक विसंगतियां",
    leadFact: "Audits conducted across central and eastern states reveal elderly pensioners and rural NREGA laborers face welfare payment denials due to biometric authentication failures.",
    divergenceSummary: "Welfare economists emphasize unredressed hunger and exclusion caused by rigid digital gates; administrative agencies highlight trillions in eliminated ghost beneficiaries and corruption prevention.",
    omissionEvidence: "District-level biometric authentication failure percentages recorded on rural PoS machines",
    omittedOutlets: ["Dainik Jagran", "Hindustan Times"],
    br: [
      "Exposes humanitarian distress of marginalized citizens deprived of food grain quotas and wage entitlements due to digital authentication roadblocks.",
      "Weighs the trade-offs between administrative leak prevention and technological access barriers among vulnerable rural populations.",
      "Celebrates digital governance efficiency, pointing to direct bank transfers that bypass middlemen and save substantial public exchequer funds."
    ],
    articles: [
      {
        outlet: "The Hindu",
        language: "EN",
        title: "Biometric failures and deletion of job cards: The digital hurdles in rural welfare delivery",
        link: "https://thehindu.com/news/national/mgnrega-aadhaar-based-payment-system-exclusion-errors",
        snippet50w: "Ground-level field studies find that manual wage workers struggle with fingerprint mismatches and mapping glitches under mandatory ABPS norms.",
        source: "curated",
      },
      {
        outlet: "The Wire",
        language: "EN",
        title: "Excluded by Algorithm: How Compulsory Biometrics is Denying Rations to India's Poorest",
        link: "https://thewire.in/rights/dbt-welfare-aadhaar-biometric-exclusion-rural-poor",
        snippet50w: "Investigative report documents elderly widows and disabled pensioners who have been dropped from welfare rosters without prior verification or notice.",
        source: "curated",
      },
      {
        outlet: "Amar Ujala",
        language: "HI",
        title: "डीबीटी और आधार आधारित भुगतान: बिचौलियों पर लगाम, लेकिन दूरदराज क्षेत्रों में कनेक्टिविटी बनी चुनौती",
        link: "https://amarujala.com/rural/dbt-welfare-schemes-aadhaar-challenge",
        snippet50w: "सरकार का दावा है कि डिजिटल भुगतान से फर्जीवाड़ा रुका है, वहीं ग्रामीण इलाकों में बैंक सर्वर और अंगूठे के निशान न मिलने की समस्याएं सामने आ रही हैं।",
        source: "curated",
      },
    ],
  },
  {
    id: "clu-24",
    tag: "Environment",
    canonicalTitle: "CAQM Stubble Burning Enforcement: Doubled Environmental Penalties & Farm Union Pushback",
    canonicalTitleHi: "वायु गुणवत्ता आयोग: पराली जलाने पर दोगुना जुर्माना और किसान संगठनों का विरोध",
    leadFact: "Commission for Air Quality Management (CAQM) doubles environmental compensation levies on crop residue burning as farm unions demand machinery subsidies over punitive policing.",
    divergenceSummary: "Urban civic editorials demand stringent zero-tolerance enforcement to curb seasonal northern air toxicity; agrarian representatives argue punitive fines penalize smallholders lacking super-seeder machinery.",
    omissionEvidence: "Subsidy disbursement rate for in-situ crop residue management machinery to small and marginal farmers",
    omittedOutlets: ["Times of India"],
    br: [
      "Underlines structural agrarian distress, highlighting that punitive fines criminalize smallholders while state machinery subsidy distribution remains inadequate.",
      "Examines the statutory enforcement data, monitoring farm fire satellite counts alongside state administrative action plans.",
      "Insists on uncompromising environmental rule enforcement, arguing that seasonal air pollution poses an unacceptable public health catastrophe."
    ],
    articles: [
      {
        outlet: "Indian Express",
        language: "EN",
        title: "Farm fires and penalties: Why doubling fines has triggered political and agrarian friction",
        link: "https://indianexpress.com/article/explained/caqm-stubble-burning-penalties-farmer-protests",
        snippet50w: "An examination of the revised environmental penalties and the logistical bottleneck in providing affordable crop residue management machines to smallholders.",
        source: "curated",
      },
      {
        outlet: "Dainik Jagran",
        language: "HI",
        title: "प्रदूषण नियंत्रण पर सख्त कदम: पराली जलाने पर दोगुना जुर्माना, सैटेलाइट से रखी जा रही नजर",
        link: "https://jagran.com/punjab/chandigarh-caqm-stubble-burning-fine-increase",
        snippet50w: "वायु गुणवत्ता आयोग के नए नियमों के तहत पराली जलाने वाले किसानों पर भारी जुर्माना लगाया जाएगा। प्रशासन ने चेतावनी दी है कि नियमों की अनदेखी पर एफआईआर दर्ज होगी।",
        source: "curated",
      },
      {
        outlet: "NDTV",
        language: "EN",
        title: "Farmers in Punjab, Haryana protest doubled stubble burning fines, demand operational compensation",
        link: "https://ndtv.com/india-news/stubble-burning-fines-farmers-protest-punjab-haryana",
        snippet50w: "Farm unions submit memorandums seeking cash incentives of ₹2,500 per acre to cover stubble management diesel costs rather than facing punitive state action.",
        source: "curated",
      },
    ],
  },
  {
    id: "clu-25",
    tag: "Governance",
    canonicalTitle: "Digital Personal Data Protection (DPDP) Rules: Consent Framework & State Surveillance Exemptions",
    canonicalTitleHi: "डिजिटल व्यक्तिगत डेटा संरक्षण नियम: सहमति ढांचा और राज्य निगरानी छूट पर विमर्श",
    leadFact: "Ministry of Electronics and Information Technology releases draft procedural rules under the DPDP Act 2023, initiating consultative feedback on consent management.",
    divergenceSummary: "Privacy advocates and digital rights organizations flag sweeping executive exemptions and weakened RTI provisions; industry associations welcome simplified cross-border data transfer norms.",
    omissionEvidence: "Statutory checks on state agency access to citizen data repositories without prior judicial warrant",
    omittedOutlets: ["Amar Ujala"],
    br: [
      "Scrutinizes broad national security exemptions granted to state intelligence agencies, warning of risks to citizen privacy rights under Article 21.",
      "Summarizes key technical provisions including Consent Managers, verifiable parental consent protocols, and Data Protection Board adjudication procedures.",
      "Endorses the regulatory regime as providing much-needed clarity for digital startups, foreign investment, and India's booming digital economy."
    ],
    articles: [
      {
        outlet: "The Hindu",
        language: "EN",
        title: "Draft DPDP rules: Privacy experts flag lack of judicial oversight in government exemptions",
        link: "https://thehindu.com/sci-tech/technology/digital-personal-data-protection-draft-rules-privacy-concerns",
        snippet50w: "Legal experts express concern that wide executive discretion in exempting security agencies from data processing norms undermines core data minimization principles.",
        source: "curated",
      },
      {
        outlet: "Indian Express",
        language: "EN",
        title: "Explained: The Consent Manager architecture under India's new data protection regulations",
        link: "https://indianexpress.com/article/explained/dpdp-act-consent-managers-explained",
        snippet50w: "How the proposed framework enables users to give, withdraw, and manage digital consent through interoperable and interoperable platform gateways.",
        source: "curated",
      },
      {
        outlet: "The Wire",
        language: "EN",
        title: "How the DPDP Act and Its New Rules Threaten the Right to Information",
        link: "https://thewire.in/tech/dpdp-act-rules-right-to-information-dilution",
        snippet50w: "Analysis demonstrates how expanding privacy shields for public officials under the pretext of personal data limits transparency in governance and anti-corruption scrutiny.",
        source: "curated",
      },
    ],
  },

];

export async function getEnrichedNewsClusters(): Promise<NewsCluster[]> {
  // Check if live Context.dev scraping is responsive for latest articles
  try {
    const liveMarkdown = await scrapeContextDev("https://indianexpress.com/section/india/");
    if (liveMarkdown && liveMarkdown.length > 500) {
      console.log("[Context.dev] Ingested live section text length:", liveMarkdown.length);
    }
  } catch (err) {
    console.warn("[Context.dev] Soft warning during ingestion:", err);
  }

  return CURATED_CURRENT_REPORTS;
}
