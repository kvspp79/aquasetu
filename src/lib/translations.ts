export type Language = 'en' | 'hi' | 'te';

export interface TranslationDict {
  appName: string;
  appBadge: string;
  ministryName: string;
  portalRole: string;
  activeAgents: string;
  emergencySos: string;
  launchEngine: string;
  learnMore: string;
  selectLanguage: string;
  getStarted: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  roles: {
    officer: string;
    officerDesc: string;
    admin: string;
    adminDesc: string;
    farmer: string;
    farmerDesc: string;
    utility: string;
    utilityDesc: string;
    industry: string;
    industryDesc: string;
  };
  tabs: {
    home: string;
    about: string;
    decisionEngine: string;
    canalDashboard: string;
    farmerDashboard: string;
    govDashboard: string;
    analytics: string;
    knowledgeCentre: string;
    emergencySos: string;
    developerHub: string;
    contact: string;
  };
  metrics: {
    canals: string;
    villages: string;
    waterSaved: string;
    disputes: string;
    reservoirStorage: string;
    dailyDemand: string;
    currentInflow: string;
    fairnessIndex: string;
  };
  decisions: {
    header: string;
    subheader: string;
    runEngine: string;
    running: string;
    coordinating: string;
    approveAndDispatch: string;
    pendingApproval: string;
    ledgerTitle: string;
    requested: string;
    allocated: string;
  };
  farmer: {
    header: string;
    subheader: string;
    chooseBlock: string;
    todayAllocation: string;
    telemetryHeader: string;
    cropCategory: string;
    growthStage: string;
    irrigatedArea: string;
    moistureChart: string;
    moistureDesc: string;
    debtLedger: string;
    debtDesc: string;
  };
  contact: {
    header: string;
    subheader: string;
    formName: string;
    formPhone: string;
    formVillage: string;
    formCategory: string;
    formDesc: string;
    submitGrievance: string;
    receiptTitle: string;
    receiptDesc: string;
  };
}

export const translations: Record<Language, TranslationDict> = {
  en: {
    appName: "AquaSetu",
    appBadge: "DESIGNED BY KVSP PRANEETH",
    ministryName: "Ministry of Jal Shakti | Smart Irrigation",
    portalRole: "PORTAL ROLE:",
    activeAgents: "COOPERATING AGENTS",
    emergencySos: "EMERGENCY SOS",
    launchEngine: "Launch Decision Engine",
    learnMore: "Learn More",
    selectLanguage: "Select Language / भाषा चुनें / భాషను ఎంచుకోండి",
    getStarted: "Proceed to Platform",
    welcomeTitle: "Adaptive Decision Intelligence for Canal Water Allocation",
    welcomeSubtitle: "AquaSetu is an explainable multi-agent system resolving water-scarcity disputes along canal links. Combining SCADA telemetry, crop stress biology, and game-theory optimization to deliver equity across rural command areas.",
    roles: {
      officer: "Canal Officer",
      officerDesc: "Approvals & Gates",
      admin: "Govt Admin",
      adminDesc: "District Collector / Auditor",
      farmer: "Village Rep",
      farmerDesc: "Farmer Union / WUA",
      utility: "Water Utility",
      utilityDesc: "Urban Distribution",
      industry: "Industrial User",
      industryDesc: "Bulk Flow Auditor"
    },
    tabs: {
      home: "Home Portal",
      about: "About AquaSetu",
      decisionEngine: "AI Decision Engine",
      canalDashboard: "Canal Dashboard",
      farmerDashboard: "Farmer Dashboard",
      govDashboard: "Govt Dashboard",
      analytics: "Interactive Analytics",
      knowledgeCentre: "River Knowledge",
      emergencySos: "SOS Incident Room",
      developerHub: "Developer Hub & Docs",
      contact: "Contact & Support"
    },
    metrics: {
      canals: "Canals Managed",
      villages: "Villages Connected",
      waterSaved: "Water Saved (Daily)",
      disputes: "Conflict Disputes Reduced",
      reservoirStorage: "RESERVOIR STORAGE",
      dailyDemand: "DAILY WATER DEMAND",
      currentInflow: "CURRENT HEAD INFLOW",
      fairnessIndex: "AGGREGATE ETHICAL FAIRNESS"
    },
    decisions: {
      header: "AI Decision Optimization Grid",
      subheader: "Configure watershed variables and execute Nash bargaining equations",
      runEngine: "Run AI Decision Engine",
      running: "Executing Multi-Agent LP Solver...",
      coordinating: "AI Coordinator Strategy Report",
      approveAndDispatch: "Approve and Dispatch",
      pendingApproval: "Pending SCADA Approval Sign-off",
      ledgerTitle: "Negotiated Allocations Ledger",
      requested: "REQUESTED",
      allocated: "ALLOCATED"
    },
    farmer: {
      header: "Farmer Quota & Demand Room",
      subheader: "Water User Association (WUA) specific credits, allotments & soil charts",
      chooseBlock: "CHOOSE VILLAGE:",
      todayAllocation: "TODAY'S ALLOTMENT",
      telemetryHeader: "Agrarian Telemetry",
      cropCategory: "CROP CATEGORY",
      growthStage: "GROWTH STAGE",
      irrigatedArea: "IRRIGATED AREA",
      moistureChart: "Daily Soil Moisture Index Chart",
      moistureDesc: "SCADA moisture sensors mapped against permanent wilting coefficient thresholds (35%)",
      debtLedger: "PIM Water Debt Ledger Logs",
      debtDesc: "Under Participatory Irrigation guidelines, water deficits in dry rotations are credited. A negative balance guarantees boosted priority in subsequent supply cycles."
    },
    contact: {
      header: "Contact & Grievance Support",
      subheader: "Submit official water user complaints to the Department of Water Resources",
      formName: "Full Name",
      formPhone: "Mobile No (for SMS tracker)",
      formVillage: "Your Agro Block/Village",
      formCategory: "Complaint Category",
      formDesc: "Detailed Description of Grievance",
      submitGrievance: "File Official Grievance",
      receiptTitle: "Grievance Ticket Created",
      receiptDesc: "Your complaint has been registered on the National Jal Shakti portal. An SMS tracker has been dispatched to your mobile."
    }
  },
  hi: {
    appName: "एक्वासेतु (AquaSetu)",
    appBadge: "by kvsp praneeth द्वारा निर्मित",
    ministryName: "जल शक्ति मंत्रालय | स्मार्ट सिंचाई",
    portalRole: "पोर्टल भूमिका:",
    activeAgents: "सहयोगी एजेंट",
    emergencySos: "आपातकालीन सहायता (SOS)",
    launchEngine: "निर्णय इंजन चलाएं",
    learnMore: "अधिक जानें",
    selectLanguage: "भाषा का चयन करें",
    getStarted: "प्लेटफॉर्म पर जाएं",
    welcomeTitle: "नहर जल आवंटन के लिए अनुकूली निर्णय खुफिया प्रणाली",
    welcomeSubtitle: "एक्वासेतु एक व्याख्या योग्य बहु-एजेंट प्रणाली है जो नहर लिंक के साथ पानी की कमी के विवादों को हल करती है। ग्रामीण कमान क्षेत्रों में समानता प्रदान करने के लिए स्काडा टेलीमेट्री, फसल तनाव जीव विज्ञान और खेल-सिद्धांत अनुकूलन का संयोजन।",
    roles: {
      officer: "नहर अधिकारी",
      officerDesc: "स्वीकृति और गेट नियंत्रण",
      admin: "सरकारी प्रशासक",
      adminDesc: "जिला कलेक्टर / लेखा परीक्षक",
      farmer: "ग्राम प्रतिनिधि",
      farmerDesc: "किसान संघ / जल उपभोक्ता संघ",
      utility: "जल उपयोगिता",
      utilityDesc: "शहरी जल वितरण",
      industry: "औद्योगिक उपयोगकर्ता",
      industryDesc: "थोक प्रवाह लेखा परीक्षक"
    },
    tabs: {
      home: "मुख्य पोर्टल",
      about: "एक्वासेतु के बारे में",
      decisionEngine: "एआई निर्णय इंजन",
      canalDashboard: "नहर डैशबोर्ड",
      farmerDashboard: "किसान डैशबोर्ड",
      govDashboard: "प्रशासन डैशबोर्ड",
      analytics: "इंटरैक्टिव विश्लेषण",
      knowledgeCentre: "नदी ज्ञान केंद्र",
      emergencySos: "आपातकालीन नियंत्रण कक्ष",
      developerHub: "डेवलपर हब और दस्तावेज़",
      contact: "संपर्क और सहायता"
    },
    metrics: {
      canals: "प्रबंधित नहरें",
      villages: "संबद्ध ग्राम पंचायतें",
      waterSaved: "दैनिक जल बचत",
      disputes: "जल विवादों में कमी",
      reservoirStorage: "जलाशय भंडारण",
      dailyDemand: "दैनिक जल मांग",
      currentInflow: "वर्तमान इनफ्लो दर",
      fairnessIndex: "कुल नैतिक निष्पक्षता"
    },
    decisions: {
      header: "एआई निर्णय अनुकूलन ग्रिड",
      subheader: "जलसंभर चर कॉन्फ़िगर करें और नैश सौदेबाजी समीकरण निष्पादित करें",
      runEngine: "एआई निर्णय इंजन चलाएं",
      running: "बहु-एजेंट एलपी सॉल्वर निष्पादित कर रहा है...",
      coordinating: "एआई समन्वयक रणनीति रिपोर्ट",
      approveAndDispatch: "स्वीकृत करें और प्रेषित करें",
      pendingApproval: "लंबित स्काडा अनुमोदन हस्ताक्षर",
      ledgerTitle: "सहमति आवंटन बहीखाता",
      requested: "अनुरोधित जल",
      allocated: "आवंटित जल"
    },
    farmer: {
      header: "किसान कोटा और मांग कक्ष",
      subheader: "जल उपयोगकर्ता संघ (WUA) विशिष्ट क्रेडिट, आवंटन और मिट्टी नमी चार्ट",
      chooseBlock: "ग्राम चुनें:",
      todayAllocation: "आज का जल आवंटन",
      telemetryHeader: "कृषि टेलीमेट्री",
      cropCategory: "फसल श्रेणी",
      growthStage: "फसल वृद्धि चरण",
      irrigatedArea: "सिंचित क्षेत्र",
      moistureChart: "दैनिक मृदा नमी चार्ट",
      moistureDesc: "स्काडा नमी सेंसर डेटा स्थाई मुरझाने के गुणांक थ्रेशोल्ड (35%) के साथ मैप किया गया",
      debtLedger: "पीआईएम जल ऋण बहीखाता लॉग",
      debtDesc: "सहभागी सिंचाई दिशानिर्देशों के तहत, शुष्क चक्रों में जल की कमी को बहीखाते में जमा किया जाता है। नकारात्मक संतुलन अगले चक्र में बढ़ी हुई प्राथमिकता सुनिश्चित करता है।"
    },
    contact: {
      header: "संपर्क और शिकायत निवारण",
      subheader: "जल संसाधन विभाग को आधिकारिक जल उपयोग शिकायतें सबमिट करें",
      formName: "पूरा नाम",
      formPhone: "मोबाइल नंबर (एसएमएस ट्रैकर के लिए)",
      formVillage: "आपका कृषि ब्लॉक/गांव",
      formCategory: "शिकायत श्रेणी",
      formDesc: "शिकायत का विस्तृत विवरण",
      submitGrievance: "आधिकारिक शिकायत दर्ज करें",
      receiptTitle: "शिकायत टिकट बनाया गया",
      receiptDesc: "आपकी शिकायत राष्ट्रीय जल शक्ति पोर्टल पर पंजीकृत हो गई है। आपके मोबाइल पर एक एसएमएस ट्रैकर भेजा गया है।"
    }
  },
  te: {
    appName: "ఆక్వాసేతు (AquaSetu)",
    appBadge: "by kvsp praneeth రూపకల్పన",
    ministryName: "జల శక్తి మంత్రిత్వ శాఖ | స్మార్ట్ సాగునీరు",
    portalRole: "పోర్టల్ పాత్ర:",
    activeAgents: "సహకార ఏజెంట్లు",
    emergencySos: "అత్యవసర సహాయం (SOS)",
    launchEngine: "నిర్ణయ ఇంజిన్ ప్రారంభించు",
    learnMore: "మరింత తెలుసుకోండి",
    selectLanguage: "భాషను ఎంచుకోండి",
    getStarted: "ప్లాట్‌ఫారమ్‌కు వెళ్లండి",
    welcomeTitle: "కాలువ నీటి కేటాయింపు కొరకు అనుకూల నిర్ణయ మేధస్సు వ్యవస్థ",
    welcomeSubtitle: "ఆక్వాసేతు అనేది కాలువ లింకుల వెంట నీటి కొరత వివాదాలను పరిష్కరించే వివరణాత్మక బహుళ-ఏజెంట్ వ్యవస్థ. గ్రామీణ కమాండ్ ఏరియాలలో సమానత్వాన్ని అందించడానికి స్కాడా టెలిమెట్రీ, పంట ఒత్తిడి జీవశాస్త్రం మరియు గేమ్-థియరీ ఆప్టిమైజేషన్ కలయిక.",
    roles: {
      officer: "కాలువ అధికారి",
      officerDesc: "ఆమోదాలు & గేట్ నియంత్రణ",
      admin: "ప్రభుత్వ నిర్వాహకుడు",
      adminDesc: "జిల్లా కలెక్టర్ / ఆడిటర్",
      farmer: "గ్రామ ప్రతినిధి",
      farmerDesc: "రైతు సంఘం / నీటి వినియోగదారుల సంఘం (WUA)",
      utility: "నీటి వినియోగ సంస్థ",
      utilityDesc: "పట్టణ పంపిణీ",
      industry: "పారిశ్రామిక వినియోగదారుడు",
      industryDesc: "బల్క్ ఫ్లో ఆడిటర్"
    },
    tabs: {
      home: "ప్రధాన పోర్టల్",
      about: "ఆక్వాసేతు గురించి",
      decisionEngine: "AI నిర్ణయ ఇంజిన్",
      canalDashboard: "కాలువ డాష్‌బోర్డ్",
      farmerDashboard: "రైతు డాష్‌బోర్డ్",
      govDashboard: "ప్రభుత్వ డాష్‌బోర్డ్",
      analytics: "ఇంటరాక్టివ్ విశ్లేషణ",
      knowledgeCentre: "నది జ్ఞాన కేంద్రం",
      emergencySos: "అత్యవసర నియంత్రణ గది",
      developerHub: "డెవలపర్ హబ్ & డాక్స్",
      contact: "సంప్రదింపులు & మద్దతు"
    },
    metrics: {
      canals: "నిర్వహించబడుతున్న కాలువలు",
      villages: "అనుసంధానించబడిన గ్రామ పంచాయతీలు",
      waterSaved: "దినసరి నీటి పొదుపు",
      disputes: "నీటి వివాదాల తగ్గింపు",
      reservoirStorage: "జలాశయ నిల్వ",
      dailyDemand: "రోజువారీ నీటి డిమాండ్",
      currentInflow: "ప్రస్తుత ఇన్ఫ్లో రేటు",
      fairnessIndex: "మొత్తం నైతిక నిష్పాక్షికత"
    },
    decisions: {
      header: "AI నిర్ణయ ఆప్టిమైజేషన్ గ్రిడ్",
      subheader: "వాటర్‌షెడ్ వేరియబుల్స్ కాన్ఫిగర్ చేయండి మరియు నాష్ బేరసారాల సమీకరణాలను అమలు చేయండి",
      runEngine: "AI నిర్ణయ ఇంజిన్ రన్ చేయి",
      running: "మల్టీ-ఏజెంట్ LP సాల్వర్ రన్ అవుతోంది...",
      coordinating: "AI కోఆర్డినేటర్ స్ట్రాటజీ నివేదిక",
      approveAndDispatch: "ఆమోదించి పంపించండి",
      pendingApproval: "స్కాడా ఆమోదం సంతకం పెండింగ్‌లో ఉంది",
      ledgerTitle: "కేటాయింపుల బహీఖాతా",
      requested: "అభ్యర్థించిన నీరు",
      allocated: "కేటాయించిన నీరు"
    },
    farmer: {
      header: "రైతు కోటా & డిమాండ్ గది",
      subheader: "నీటి వినియోగదారుల సంఘం (WUA) నిర్దిష్ట క్రెడిట్‌లు, కేటాయింపులు & నేల తేమ చార్టులు",
      chooseBlock: "గ్రామాన్ని ఎంచుకోండి:",
      todayAllocation: "నేటి నీటి కేటాయింపు",
      telemetryHeader: "వ్యవసాయ టెలిమెట్రీ",
      cropCategory: "పంట రకం",
      growthStage: "పంట దశ",
      irrigatedArea: "సాగు విస్తీర్ణం",
      moistureChart: "రోజువారీ నేల తేమ చార్ట్",
      moistureDesc: "స్కాడా తేమ సెన్సార్ డేటా నిరంతర వడలిపోవు గుణకం పరిమితి (35%) తో సరిపోల్చబడింది",
      debtLedger: "PIM నీటి అప్పుల బహీఖాతా లాగ్‌లు",
      debtDesc: "భాగస్వామ్య నీటి పారుదల మార్గదర్శకాల ప్రకారం, పొడి కాలంలో నీటి కొరతను బహీఖాతాలో జమ చేస్తారు. ప్రతికూల బ్యాలెన్స్ తదుపరి కేటాయింపులో ప్రాధాన్యతను పెంచుతుంది."
    },
    contact: {
      header: "సంప్రదింపులు & ఫిర్యాదుల మద్దతు",
      subheader: "జల వనరుల శాఖకు అధికారిక నీటి వినియోగ ఫిర్యాదులను సమర్పించండి",
      formName: "పూర్తి పేరు",
      formPhone: "మొబైల్ సంఖ్య (SMS ట్రాకర్ కోసం)",
      formVillage: "మీ వ్యవసాయ బ్లాక్/గ్రామం",
      formCategory: "ఫిర్యాదు వర్గం",
      formDesc: "ఫిర్యాదు యొక్క వివరణాत्मक నివేదిక",
      submitGrievance: "అధికారిక ఫిర్యాదును దాఖలు చేయండి",
      receiptTitle: "ఫిర్యాదు టికెట్ సృష్టించబడింది",
      receiptDesc: "మీ ఫిర్యాదు జాతీయ జల శక్తి పోర్టల్‌లో విజయవంతంగా నమోదైంది. మీ మొబైల్‌కు ఒక SMS ట్రాకర్ పంపబడింది."
    }
  }
};
