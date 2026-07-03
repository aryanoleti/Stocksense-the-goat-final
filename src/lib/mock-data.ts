export type Stock = {
  symbol: string;
  name: string;
  sector: string;
  basePrice: number;
  marketCap: number; // in crores
  peRatio: number;
  dividendYield: number;
  eps: number;
  beta: number;
  week52High: number;
  week52Low: number;
  volume: number;
  about: string;
};

export const NIFTY_50: Stock[] = [
  { symbol: "RELIANCE", name: "Reliance Industries", sector: "Energy", basePrice: 2856.45, marketCap: 1932000, peRatio: 28.4, dividendYield: 0.32, eps: 100.5, beta: 1.05, week52High: 3024, week52Low: 2210, volume: 8450000, about: "India's largest conglomerate with interests in oil-to-chemicals, telecom (Jio), and retail." },
  { symbol: "TCS", name: "Tata Consultancy Services", sector: "IT", basePrice: 3942.10, marketCap: 1425000, peRatio: 31.2, dividendYield: 1.5, eps: 126.4, beta: 0.78, week52High: 4254, week52Low: 3060, volume: 2150000, about: "India's largest IT services company and part of the Tata Group." },
  { symbol: "INFY", name: "Infosys", sector: "IT", basePrice: 1814.55, marketCap: 752000, peRatio: 26.5, dividendYield: 2.1, eps: 68.5, beta: 0.85, week52High: 1953, week52Low: 1395, volume: 4920000, about: "Global leader in next-generation digital services and consulting." },
  { symbol: "HDFCBANK", name: "HDFC Bank", sector: "Banking", basePrice: 1698.20, marketCap: 1290000, peRatio: 20.1, dividendYield: 1.1, eps: 84.4, beta: 0.92, week52High: 1794, week52Low: 1363, volume: 11250000, about: "India's largest private sector bank by assets and market capitalisation." },
  { symbol: "ICICIBANK", name: "ICICI Bank", sector: "Banking", basePrice: 1241.85, marketCap: 875000, peRatio: 18.9, dividendYield: 0.8, eps: 65.7, beta: 0.95, week52High: 1364, week52Low: 970, volume: 13420000, about: "Leading Indian multinational private bank." },
  { symbol: "SBIN", name: "State Bank of India", sector: "Banking", basePrice: 814.30, marketCap: 727000, peRatio: 9.8, dividendYield: 1.5, eps: 83.1, beta: 1.18, week52High: 912, week52Low: 600, volume: 24100000, about: "India's largest public sector bank." },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", sector: "Telecom", basePrice: 1632.40, marketCap: 920000, peRatio: 56.4, dividendYield: 0.5, eps: 28.9, beta: 0.66, week52High: 1779, week52Low: 1098, volume: 6840000, about: "Leading global telecommunications company." },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever", sector: "FMCG", basePrice: 2342.10, marketCap: 550000, peRatio: 52.1, dividendYield: 1.8, eps: 44.9, beta: 0.42, week52High: 2768, week52Low: 2172, volume: 1380000, about: "FMCG major with iconic brands like Surf, Lifebuoy, Dove and Lipton." },
  { symbol: "ITC", name: "ITC Ltd", sector: "FMCG", basePrice: 425.80, marketCap: 530000, peRatio: 26.2, dividendYield: 3.3, eps: 16.3, beta: 0.61, week52High: 499, week52Low: 392, volume: 9650000, about: "Multi-business conglomerate spanning FMCG, hotels, paperboards, packaging and agribusiness." },
  { symbol: "LT", name: "Larsen & Toubro", sector: "Infra", basePrice: 3624.00, marketCap: 498000, peRatio: 35.5, dividendYield: 0.7, eps: 102.1, beta: 1.21, week52High: 3886, week52Low: 2965, volume: 1480000, about: "India's largest engineering & construction company." },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank", sector: "Banking", basePrice: 1748.55, marketCap: 348000, peRatio: 19.8, dividendYield: 0.1, eps: 88.4, beta: 0.88, week52High: 1942, week52Low: 1543, volume: 4520000, about: "Leading private sector bank in India." },
  { symbol: "AXISBANK", name: "Axis Bank", sector: "Banking", basePrice: 1098.40, marketCap: 339000, peRatio: 13.5, dividendYield: 0.1, eps: 81.4, beta: 1.12, week52High: 1340, week52Low: 951, volume: 8920000, about: "Third largest private sector bank in India." },
  { symbol: "MARUTI", name: "Maruti Suzuki India", sector: "Auto", basePrice: 11240.00, marketCap: 354000, peRatio: 28.8, dividendYield: 1.0, eps: 390.5, beta: 0.97, week52High: 13680, week52Low: 9737, volume: 480000, about: "India's largest passenger car manufacturer." },
  { symbol: "ASIANPAINT", name: "Asian Paints", sector: "Paints", basePrice: 2342.40, marketCap: 224500, peRatio: 50.2, dividendYield: 1.3, eps: 46.7, beta: 0.78, week52High: 3422, week52Low: 2125, volume: 1340000, about: "India's leading paint and decorative coatings company." },
  { symbol: "SUNPHARMA", name: "Sun Pharma", sector: "Pharma", basePrice: 1725.45, marketCap: 414000, peRatio: 39.4, dividendYield: 0.8, eps: 43.8, beta: 0.55, week52High: 1960, week52Low: 1280, volume: 2100000, about: "India's largest pharmaceutical company by revenue." },
  { symbol: "TITAN", name: "Titan Company", sector: "Consumer", basePrice: 3326.00, marketCap: 295000, peRatio: 88.2, dividendYield: 0.3, eps: 37.7, beta: 0.81, week52High: 3886, week52Low: 3056, volume: 940000, about: "Watches, jewellery (Tanishq) and eyewear major from the Tata Group." },
  { symbol: "BAJFINANCE", name: "Bajaj Finance", sector: "Finance", basePrice: 6918.00, marketCap: 428000, peRatio: 28.4, dividendYield: 0.5, eps: 243.6, beta: 1.25, week52High: 8190, week52Low: 6188, volume: 760000, about: "India's leading non-banking financial company." },
  { symbol: "WIPRO", name: "Wipro", sector: "IT", basePrice: 543.80, marketCap: 287000, peRatio: 24.8, dividendYield: 0.2, eps: 21.9, beta: 0.74, week52High: 605, week52Low: 384, volume: 7820000, about: "Leading global IT, consulting and business process services company." },
  { symbol: "ULTRACEMCO", name: "UltraTech Cement", sector: "Cement", basePrice: 10982.00, marketCap: 318000, peRatio: 48.7, dividendYield: 0.5, eps: 225.5, beta: 1.04, week52High: 12134, week52Low: 8470, volume: 320000, about: "India's largest cement manufacturer and exporter." },
  { symbol: "NESTLEIND", name: "Nestle India", sector: "FMCG", basePrice: 2298.50, marketCap: 222000, peRatio: 76.4, dividendYield: 1.0, eps: 30.1, beta: 0.46, week52High: 2778, week52Low: 2120, volume: 410000, about: "Indian subsidiary of Nestle, with Maggi, Nescafe and KitKat among its brands." },
  { symbol: "POWERGRID", name: "Power Grid", sector: "Power", basePrice: 318.20, marketCap: 296000, peRatio: 19.4, dividendYield: 3.6, eps: 16.4, beta: 0.69, week52High: 366, week52Low: 245, volume: 6420000, about: "India's principal electric power transmission company." },
  { symbol: "NTPC", name: "NTPC", sector: "Power", basePrice: 366.40, marketCap: 355000, peRatio: 18.2, dividendYield: 2.1, eps: 20.1, beta: 0.85, week52High: 448, week52Low: 285, volume: 8120000, about: "India's largest power generation company." },
  { symbol: "TATAMOTORS", name: "Tata Motors", sector: "Auto", basePrice: 712.80, marketCap: 263000, peRatio: 12.5, dividendYield: 0.4, eps: 57.0, beta: 1.33, week52High: 1179, week52Low: 670, volume: 18500000, about: "Leading Indian automotive manufacturer, parent of Jaguar Land Rover." },
  { symbol: "ADANIENT", name: "Adani Enterprises", sector: "Infra", basePrice: 2186.20, marketCap: 252000, peRatio: 71.2, dividendYield: 0.1, eps: 30.7, beta: 1.65, week52High: 3257, week52Low: 2025, volume: 3450000, about: "Flagship company of the Adani Group with diverse business interests." },
  { symbol: "ADANIPORTS", name: "Adani Ports & SEZ", sector: "Infra", basePrice: 1248.00, marketCap: 269000, peRatio: 27.5, dividendYield: 0.4, eps: 45.4, beta: 1.37, week52High: 1621, week52Low: 1014, volume: 4180000, about: "India's largest commercial port operator." },
  { symbol: "HCLTECH", name: "HCL Technologies", sector: "IT", basePrice: 1290.40, marketCap: 350000, peRatio: 26.9, dividendYield: 4.0, eps: 48.0, beta: 0.79, week52High: 1903, week52Low: 1245, volume: 3220000, about: "Multinational IT services and consulting company." },
  { symbol: "M&M", name: "Mahindra & Mahindra", sector: "Auto", basePrice: 2865.00, marketCap: 357000, peRatio: 25.7, dividendYield: 0.7, eps: 111.5, beta: 1.08, week52High: 3270, week52Low: 1786, volume: 1840000, about: "Major Indian SUV and tractor manufacturer." },
  { symbol: "TECHM", name: "Tech Mahindra", sector: "IT", basePrice: 1542.30, marketCap: 150000, peRatio: 34.1, dividendYield: 2.6, eps: 45.2, beta: 0.81, week52High: 1808, week52Low: 1180, volume: 2120000, about: "Indian multinational IT services and consulting company." },
  { symbol: "ONGC", name: "ONGC", sector: "Energy", basePrice: 268.50, marketCap: 338000, peRatio: 9.2, dividendYield: 4.5, eps: 29.2, beta: 1.12, week52High: 345, week52Low: 218, volume: 11420000, about: "India's largest crude oil and natural gas company." },
  { symbol: "INDUSINDBK", name: "IndusInd Bank", sector: "Banking", basePrice: 1188.50, marketCap: 92000, peRatio: 10.4, dividendYield: 1.4, eps: 114.5, beta: 1.21, week52High: 1694, week52Low: 936, volume: 6850000, about: "Private sector bank focused on retail and corporate banking." },
  { symbol: "BAJAJFINSV", name: "Bajaj Finserv", sector: "Finance", basePrice: 1645.00, marketCap: 262000, peRatio: 31.2, dividendYield: 0.1, eps: 52.7, beta: 1.12, week52High: 2025, week52Low: 1448, volume: 920000, about: "Holding company for the financial services businesses of the Bajaj Group." },
  { symbol: "JSWSTEEL", name: "JSW Steel", sector: "Metals", basePrice: 982.00, marketCap: 240000, peRatio: 32.8, dividendYield: 0.7, eps: 30.0, beta: 1.18, week52High: 1075, week52Low: 778, volume: 3820000, about: "Among India's largest steel producers." },
  { symbol: "TATASTEEL", name: "Tata Steel", sector: "Metals", basePrice: 162.00, marketCap: 202000, peRatio: 27.5, dividendYield: 2.2, eps: 5.9, beta: 1.31, week52High: 184, week52Low: 117, volume: 32500000, about: "One of the world's most geographically diversified steel producers." },
  { symbol: "GRASIM", name: "Grasim Industries", sector: "Cement", basePrice: 2548.00, marketCap: 172000, peRatio: 24.2, dividendYield: 0.4, eps: 105.3, beta: 1.08, week52High: 2878, week52Low: 1808, volume: 720000, about: "Flagship of the Aditya Birla Group, into cement, chemicals and viscose fibres." },
  { symbol: "HDFCLIFE", name: "HDFC Life", sector: "Insurance", basePrice: 648.00, marketCap: 139000, peRatio: 80.5, dividendYield: 0.3, eps: 8.1, beta: 0.66, week52High: 729, week52Low: 511, volume: 4220000, about: "Leading long-term life insurance solutions provider." },
  { symbol: "SBILIFE", name: "SBI Life Insurance", sector: "Insurance", basePrice: 1645.00, marketCap: 165000, peRatio: 84.2, dividendYield: 0.2, eps: 19.5, beta: 0.74, week52High: 1936, week52Low: 1308, volume: 1380000, about: "One of India's leading life insurance companies." },
  { symbol: "COALINDIA", name: "Coal India", sector: "Energy", basePrice: 447.00, marketCap: 275000, peRatio: 8.4, dividendYield: 5.2, eps: 53.2, beta: 1.05, week52High: 543, week52Low: 348, volume: 9120000, about: "World's largest coal producer." },
  { symbol: "DRREDDY", name: "Dr Reddy's Labs", sector: "Pharma", basePrice: 5412.00, marketCap: 90000, peRatio: 21.0, dividendYield: 0.7, eps: 257.7, beta: 0.62, week52High: 6810, week52Low: 4720, volume: 580000, about: "Multinational pharmaceutical company headquartered in Hyderabad." },
  { symbol: "CIPLA", name: "Cipla", sector: "Pharma", basePrice: 1448.00, marketCap: 117000, peRatio: 25.8, dividendYield: 0.9, eps: 56.1, beta: 0.58, week52High: 1715, week52Low: 1190, volume: 1880000, about: "Indian multinational pharmaceutical and biotechnology company." },
  { symbol: "DIVISLAB", name: "Divi's Labs", sector: "Pharma", basePrice: 4648.00, marketCap: 123000, peRatio: 64.5, dividendYield: 0.6, eps: 72.0, beta: 0.55, week52High: 5198, week52Low: 3458, volume: 380000, about: "Manufacturer of active pharmaceutical ingredients (APIs)." },
  { symbol: "EICHERMOT", name: "Eicher Motors", sector: "Auto", basePrice: 4748.00, marketCap: 130000, peRatio: 31.7, dividendYield: 0.8, eps: 149.8, beta: 0.96, week52High: 5301, week52Low: 3457, volume: 460000, about: "Parent of Royal Enfield and Volvo Eicher Commercial Vehicles." },
  { symbol: "HEROMOTOCO", name: "Hero MotoCorp", sector: "Auto", basePrice: 4124.00, marketCap: 82000, peRatio: 22.5, dividendYield: 3.2, eps: 183.3, beta: 0.91, week52High: 6244, week52Low: 3580, volume: 720000, about: "World's largest two-wheeler manufacturer by volume." },
  { symbol: "BAJAJ-AUTO", name: "Bajaj Auto", sector: "Auto", basePrice: 9348.00, marketCap: 260000, peRatio: 35.8, dividendYield: 2.4, eps: 261.1, beta: 0.97, week52High: 12774, week52Low: 7488, volume: 380000, about: "Major Indian two-wheeler and three-wheeler manufacturer." },
  { symbol: "BRITANNIA", name: "Britannia Industries", sector: "FMCG", basePrice: 4648.00, marketCap: 112000, peRatio: 56.0, dividendYield: 1.5, eps: 83.0, beta: 0.42, week52High: 5664, week52Low: 4513, volume: 320000, about: "One of India's leading food companies, famous for biscuits." },
  { symbol: "BPCL", name: "Bharat Petroleum", sector: "Energy", basePrice: 295.00, marketCap: 128000, peRatio: 5.4, dividendYield: 7.2, eps: 54.6, beta: 1.18, week52High: 376, week52Low: 248, volume: 5680000, about: "Maharatna PSU oil and gas refining and marketing company." },
  { symbol: "TATACONSUM", name: "Tata Consumer", sector: "FMCG", basePrice: 1085.00, marketCap: 103000, peRatio: 80.5, dividendYield: 0.7, eps: 13.5, beta: 0.62, week52High: 1268, week52Low: 880, volume: 1820000, about: "Consumer products arm of the Tata Group." },
  { symbol: "APOLLOHOSP", name: "Apollo Hospitals", sector: "Healthcare", basePrice: 6648.00, marketCap: 95000, peRatio: 92.8, dividendYield: 0.2, eps: 71.6, beta: 0.78, week52High: 7546, week52Low: 5234, volume: 280000, about: "Largest network of for-profit private hospitals in India." },
  { symbol: "HINDALCO", name: "Hindalco", sector: "Metals", basePrice: 645.00, marketCap: 144000, peRatio: 12.3, dividendYield: 0.6, eps: 52.5, beta: 1.32, week52High: 772, week52Low: 480, volume: 7240000, about: "Aluminium and copper manufacturing giant from the Aditya Birla Group." },

  // --- Banking & Financial Services ---
  { symbol: "PNB", name: "Punjab National Bank", sector: "Banking", basePrice: 108.50, marketCap: 118000, peRatio: 11.2, dividendYield: 1.8, eps: 9.7, beta: 1.28, week52High: 142, week52Low: 85, volume: 28400000, about: "One of India's largest public sector banks by branch network." },
  { symbol: "BANKBARODA", name: "Bank of Baroda", sector: "Banking", basePrice: 248.00, marketCap: 128000, peRatio: 7.1, dividendYield: 3.2, eps: 34.9, beta: 1.15, week52High: 298, week52Low: 195, volume: 12400000, about: "Major public sector bank with a large international presence." },
  { symbol: "CANBK", name: "Canara Bank", sector: "Banking", basePrice: 102.00, marketCap: 92000, peRatio: 6.4, dividendYield: 3.8, eps: 15.9, beta: 1.22, week52High: 128, week52Low: 78, volume: 15800000, about: "Public sector bank headquartered in Bengaluru, among India's oldest." },
  { symbol: "IDFCFIRSTB", name: "IDFC First Bank", sector: "Banking", basePrice: 72.00, marketCap: 52000, peRatio: 24.8, dividendYield: 0.0, eps: 2.9, beta: 1.35, week52High: 92, week52Low: 55, volume: 22100000, about: "Private bank focused on retail banking and financial inclusion." },
  { symbol: "FEDERALBNK", name: "Federal Bank", sector: "Banking", basePrice: 198.00, marketCap: 48000, peRatio: 10.9, dividendYield: 1.1, eps: 18.2, beta: 0.98, week52High: 220, week52Low: 155, volume: 9800000, about: "Kerala-based private bank with a strong NRI customer base." },
  { symbol: "BANDHANBNK", name: "Bandhan Bank", sector: "Banking", basePrice: 168.00, marketCap: 27000, peRatio: 13.5, dividendYield: 0.6, eps: 12.4, beta: 1.18, week52High: 232, week52Low: 148, volume: 8400000, about: "Bank with roots in microfinance, focused on eastern India." },
  { symbol: "AUBANK", name: "AU Small Finance Bank", sector: "Banking", basePrice: 620.00, marketCap: 42000, peRatio: 22.6, dividendYield: 0.3, eps: 27.4, beta: 1.05, week52High: 780, week52Low: 520, volume: 2400000, about: "Largest small finance bank in India by market cap." },
  { symbol: "RBLBANK", name: "RBL Bank", sector: "Banking", basePrice: 195.00, marketCap: 12000, peRatio: 15.2, dividendYield: 0.0, eps: 12.8, beta: 1.42, week52High: 285, week52Low: 148, volume: 6200000, about: "Private sector bank with a focus on retail and MSME lending." },
  { symbol: "YESBANK", name: "Yes Bank", sector: "Banking", basePrice: 19.50, marketCap: 61000, peRatio: 28.4, dividendYield: 0.0, eps: 0.7, beta: 1.55, week52High: 28, week52Low: 14, volume: 145000000, about: "Private bank that underwent a 2020 reconstruction; rebuilding its book." },
  { symbol: "PFC", name: "Power Finance Corporation", sector: "Finance", basePrice: 430.00, marketCap: 142000, peRatio: 6.8, dividendYield: 3.5, eps: 63.2, beta: 1.32, week52High: 580, week52Low: 350, volume: 8200000, about: "State-owned NBFC financing India's power sector." },
  { symbol: "RECLTD", name: "REC Limited", sector: "Finance", basePrice: 495.00, marketCap: 130000, peRatio: 7.2, dividendYield: 3.3, eps: 68.8, beta: 1.28, week52High: 650, week52Low: 380, volume: 7600000, about: "State-owned NBFC funding power infrastructure projects." },
  { symbol: "MUTHOOTFIN", name: "Muthoot Finance", sector: "Finance", basePrice: 1890.00, marketCap: 76000, peRatio: 17.5, dividendYield: 1.2, eps: 108.0, beta: 0.75, week52High: 2280, week52Low: 1450, volume: 900000, about: "India's largest gold loan NBFC." },
  { symbol: "CHOLAFIN", name: "Cholamandalam Investment", sector: "Finance", basePrice: 1245.00, marketCap: 106000, peRatio: 28.9, dividendYield: 0.2, eps: 43.1, beta: 1.08, week52High: 1610, week52Low: 1050, volume: 1100000, about: "Vehicle and home loan focused NBFC from the Murugappa Group." },
  { symbol: "LICHSGFIN", name: "LIC Housing Finance", sector: "Finance", basePrice: 615.00, marketCap: 34000, peRatio: 7.9, dividendYield: 1.6, eps: 77.8, beta: 1.18, week52High: 780, week52Low: 480, volume: 2600000, about: "Housing finance company backed by LIC." },
  { symbol: "SHRIRAMFIN", name: "Shriram Finance", sector: "Finance", basePrice: 3010.00, marketCap: 113000, peRatio: 14.2, dividendYield: 1.5, eps: 212.0, beta: 1.12, week52High: 3600, week52Low: 2200, volume: 1300000, about: "Diversified NBFC focused on commercial vehicle financing." },
  { symbol: "ICICIPRULI", name: "ICICI Prudential Life", sector: "Insurance", basePrice: 625.00, marketCap: 90000, peRatio: 78.5, dividendYield: 0.4, eps: 8.0, beta: 0.82, week52High: 760, week52Low: 480, volume: 1400000, about: "Life insurance joint venture between ICICI Bank and Prudential." },
  { symbol: "ICICIGI", name: "ICICI Lombard General Insurance", sector: "Insurance", basePrice: 1940.00, marketCap: 96000, peRatio: 32.4, dividendYield: 0.6, eps: 60.0, beta: 0.68, week52High: 2180, week52Low: 1580, volume: 380000, about: "Leading private general insurance company in India." },
  { symbol: "LICI", name: "Life Insurance Corporation of India", sector: "Insurance", basePrice: 940.00, marketCap: 594000, peRatio: 11.8, dividendYield: 0.9, eps: 79.7, beta: 0.72, week52High: 1175, week52Low: 780, volume: 2100000, about: "India's largest life insurer, state-owned." },
  { symbol: "IEX", name: "Indian Energy Exchange", sector: "Finance", basePrice: 172.00, marketCap: 15500, peRatio: 38.5, dividendYield: 1.4, eps: 4.5, beta: 1.02, week52High: 245, week52Low: 130, volume: 5200000, about: "India's leading electricity spot market exchange." },
  { symbol: "CDSL", name: "Central Depository Services", sector: "Finance", basePrice: 1480.00, marketCap: 31000, peRatio: 52.1, dividendYield: 0.7, eps: 28.4, beta: 1.15, week52High: 1990, week52Low: 950, volume: 900000, about: "One of India's two securities depositories." },
  { symbol: "BSE", name: "BSE Limited", sector: "Finance", basePrice: 2890.00, marketCap: 39000, peRatio: 44.6, dividendYield: 0.5, eps: 64.8, beta: 1.35, week52High: 6800, week52Low: 2200, volume: 700000, about: "Asia's oldest stock exchange, now a listed for-profit company." },
  { symbol: "MCX", name: "Multi Commodity Exchange", sector: "Finance", basePrice: 4750.00, marketCap: 24000, peRatio: 58.2, dividendYield: 0.3, eps: 81.6, beta: 1.08, week52High: 7200, week52Low: 3100, volume: 320000, about: "India's largest commodity derivatives exchange." },
  { symbol: "ANGELONE", name: "Angel One", sector: "Finance", basePrice: 2510.00, marketCap: 22600, peRatio: 21.4, dividendYield: 0.8, eps: 117.3, beta: 1.45, week52High: 3800, week52Low: 1900, volume: 480000, about: "Full-stack digital broking and financial services platform." },
  { symbol: "IIFL", name: "IIFL Finance", sector: "Finance", basePrice: 520.00, marketCap: 22000, peRatio: 12.6, dividendYield: 1.2, eps: 41.3, beta: 1.38, week52High: 780, week52Low: 380, volume: 1900000, about: "Diversified NBFC offering gold, home and business loans." },
  { symbol: "SBICARD", name: "SBI Cards & Payment Services", sector: "Finance", basePrice: 725.00, marketCap: 69000, peRatio: 28.9, dividendYield: 0.8, eps: 25.1, beta: 0.92, week52High: 900, week52Low: 620, volume: 1200000, about: "India's second-largest credit card issuer, backed by SBI." },
  { symbol: "PAYTM", name: "One 97 Communications (Paytm)", sector: "Finance", basePrice: 475.00, marketCap: 30000, peRatio: 0, dividendYield: 0.0, eps: -8.2, beta: 1.85, week52High: 1063, week52Low: 310, volume: 6200000, about: "Digital payments and financial services platform." },
  { symbol: "POLICYBZR", name: "PB Fintech (Policybazaar)", sector: "Finance", basePrice: 1590.00, marketCap: 71000, peRatio: 95.4, dividendYield: 0.0, eps: 16.7, beta: 1.28, week52High: 2450, week52Low: 1050, volume: 1400000, about: "Online insurance and lending marketplace." },

  // --- IT Services ---
  { symbol: "LTIM", name: "LTIMindtree", sector: "IT", basePrice: 5720.00, marketCap: 169000, peRatio: 32.1, dividendYield: 1.5, eps: 178.2, beta: 0.85, week52High: 6800, week52Low: 4450, volume: 480000, about: "IT services company formed from the merger of L&T Infotech and Mindtree." },
  { symbol: "MPHASIS", name: "Mphasis", sector: "IT", basePrice: 2810.00, marketCap: 52700, peRatio: 28.6, dividendYield: 1.8, eps: 98.2, beta: 0.88, week52High: 3200, week52Low: 2100, volume: 380000, about: "IT services company specialising in BFSI and cloud." },
  { symbol: "PERSISTENT", name: "Persistent Systems", sector: "IT", basePrice: 5240.00, marketCap: 80700, peRatio: 48.2, dividendYield: 0.5, eps: 108.7, beta: 0.92, week52High: 6800, week52Low: 3400, volume: 420000, about: "Digital engineering and software services company." },
  { symbol: "COFORGE", name: "Coforge", sector: "IT", basePrice: 7650.00, marketCap: 47500, peRatio: 42.8, dividendYield: 0.8, eps: 178.7, beta: 0.98, week52High: 9800, week52Low: 4900, volume: 280000, about: "Global IT solutions provider focused on BFSI and travel." },
  { symbol: "LTTS", name: "L&T Technology Services", sector: "IT", basePrice: 4780.00, marketCap: 50400, peRatio: 34.5, dividendYield: 1.4, eps: 138.5, beta: 0.90, week52High: 5800, week52Low: 3600, volume: 320000, about: "Engineering R&D services arm of Larsen & Toubro." },
  { symbol: "OFSS", name: "Oracle Financial Services Software", sector: "IT", basePrice: 9680.00, marketCap: 83600, peRatio: 30.2, dividendYield: 2.6, eps: 320.5, beta: 0.65, week52High: 11200, week52Low: 7200, volume: 90000, about: "Banking software subsidiary of Oracle Corporation." },
  { symbol: "KPITTECH", name: "KPIT Technologies", sector: "IT", basePrice: 1350.00, marketCap: 44700, peRatio: 58.1, dividendYield: 0.4, eps: 23.2, beta: 1.15, week52High: 1900, week52Low: 1050, volume: 900000, about: "Software focused on mobility and automotive engineering." },
  { symbol: "TATAELXSI", name: "Tata Elxsi", sector: "IT", basePrice: 6780.00, marketCap: 42200, peRatio: 46.8, dividendYield: 1.1, eps: 144.9, beta: 1.05, week52High: 9200, week52Low: 5800, volume: 210000, about: "Design and technology services for media, auto and healthcare." },
  { symbol: "ZENSAR", name: "Zensar Technologies", sector: "IT", basePrice: 730.00, marketCap: 15500, peRatio: 24.6, dividendYield: 1.9, eps: 29.7, beta: 1.10, week52High: 920, week52Low: 520, volume: 1100000, about: "Digital and technology services company under the RPG Group." },
  { symbol: "HAPPSTMNDS", name: "Happiest Minds Technologies", sector: "IT", basePrice: 745.00, marketCap: 15900, peRatio: 52.3, dividendYield: 0.9, eps: 14.2, beta: 1.22, week52High: 1180, week52Low: 580, volume: 850000, about: "Digital transformation and IT services company." },

  // --- Auto & Auto Ancillary ---
  { symbol: "TVSMOTOR", name: "TVS Motor Company", sector: "Auto", basePrice: 2480.00, marketCap: 118000, peRatio: 42.5, dividendYield: 0.5, eps: 58.4, beta: 1.02, week52High: 2900, week52Low: 1800, volume: 900000, about: "Two and three-wheeler manufacturer from the TVS Group." },
  { symbol: "ASHOKLEY", name: "Ashok Leyland", sector: "Auto", basePrice: 228.00, marketCap: 67000, peRatio: 22.4, dividendYield: 2.2, eps: 10.2, beta: 1.28, week52High: 265, week52Low: 165, volume: 8400000, about: "Second-largest commercial vehicle maker in India, Hinduja Group." },
  { symbol: "BOSCHLTD", name: "Bosch Limited", sector: "Auto", basePrice: 33200.00, marketCap: 98000, peRatio: 36.8, dividendYield: 1.2, eps: 902.0, beta: 0.72, week52High: 38500, week52Low: 22400, volume: 25000, about: "Auto component manufacturer, Indian arm of Bosch Group." },
  { symbol: "MOTHERSON", name: "Samvardhana Motherson", sector: "Auto", basePrice: 158.00, marketCap: 111000, peRatio: 32.6, dividendYield: 0.9, eps: 4.8, beta: 1.15, week52High: 210, week52Low: 105, volume: 12400000, about: "Global auto components manufacturer." },
  { symbol: "BALKRISIND", name: "Balkrishna Industries", sector: "Auto", basePrice: 2780.00, marketCap: 53700, peRatio: 29.8, dividendYield: 1.0, eps: 93.3, beta: 0.95, week52High: 3300, week52Low: 2100, volume: 380000, about: "Off-highway tyre manufacturer with global exports." },
  { symbol: "MRF", name: "MRF Limited", sector: "Auto", basePrice: 127500.00, marketCap: 54100, peRatio: 24.6, dividendYield: 0.3, eps: 5183.0, beta: 0.68, week52High: 152000, week52Low: 108000, volume: 4200, about: "India's largest tyre manufacturer by revenue." },
  { symbol: "APOLLOTYRE", name: "Apollo Tyres", sector: "Auto", basePrice: 475.00, marketCap: 30200, peRatio: 18.4, dividendYield: 1.1, eps: 25.8, beta: 1.18, week52High: 620, week52Low: 380, volume: 3800000, about: "Leading Indian tyre manufacturer with European operations." },
  { symbol: "EXIDEIND", name: "Exide Industries", sector: "Auto", basePrice: 465.00, marketCap: 39500, peRatio: 38.2, dividendYield: 0.8, eps: 12.2, beta: 1.05, week52High: 620, week52Low: 340, volume: 4200000, about: "Leading lead-acid and lithium battery manufacturer." },
  { symbol: "TIINDIA", name: "Tube Investments of India", sector: "Auto", basePrice: 3380.00, marketCap: 63400, peRatio: 52.4, dividendYield: 0.3, eps: 64.5, beta: 1.10, week52High: 4400, week52Low: 2700, volume: 320000, about: "Diversified engineering company under the Murugappa Group." },
  { symbol: "BHARATFORG", name: "Bharat Forge", sector: "Auto", basePrice: 1290.00, marketCap: 60000, peRatio: 58.6, dividendYield: 0.5, eps: 22.0, beta: 1.32, week52High: 1720, week52Low: 980, volume: 2100000, about: "Global forging and auto components manufacturer." },
  { symbol: "SONACOMS", name: "Sona BLW Precision Forgings", sector: "Auto", basePrice: 615.00, marketCap: 41000, peRatio: 48.2, dividendYield: 0.6, eps: 12.8, beta: 1.25, week52High: 780, week52Low: 480, volume: 2800000, about: "EV-focused auto component manufacturer (Sona Comstar)." },
  { symbol: "UNOMINDA", name: "UNO Minda", sector: "Auto", basePrice: 925.00, marketCap: 53500, peRatio: 44.6, dividendYield: 0.3, eps: 20.7, beta: 1.08, week52High: 1150, week52Low: 620, volume: 1800000, about: "Auto components maker specialising in switches and lighting." },

  // --- Pharma & Healthcare ---
  { symbol: "LUPIN", name: "Lupin Limited", sector: "Pharma", basePrice: 2150.00, marketCap: 98000, peRatio: 38.4, dividendYield: 0.6, eps: 56.0, beta: 0.62, week52High: 2500, week52Low: 1450, volume: 1400000, about: "Multinational pharmaceutical company known for generics." },
  { symbol: "AUROPHARMA", name: "Aurobindo Pharma", sector: "Pharma", basePrice: 1340.00, marketCap: 78500, peRatio: 18.6, dividendYield: 0.7, eps: 72.0, beta: 0.75, week52High: 1650, week52Low: 980, volume: 1800000, about: "Generic drug manufacturer with major US exposure." },
  { symbol: "ALKEM", name: "Alkem Laboratories", sector: "Pharma", basePrice: 5150.00, marketCap: 61600, peRatio: 32.1, dividendYield: 1.0, eps: 160.4, beta: 0.55, week52High: 6200, week52Low: 4200, volume: 240000, about: "Domestic-focused pharmaceutical company, strong in acute therapies." },
  { symbol: "TORNTPHARM", name: "Torrent Pharmaceuticals", sector: "Pharma", basePrice: 3420.00, marketCap: 116000, peRatio: 52.8, dividendYield: 0.7, eps: 64.8, beta: 0.58, week52High: 3800, week52Low: 2500, volume: 380000, about: "Branded generics pharma company from the Torrent Group." },
  { symbol: "ZYDUSLIFE", name: "Zydus Lifesciences", sector: "Pharma", basePrice: 970.00, marketCap: 98000, peRatio: 21.4, dividendYield: 0.7, eps: 45.3, beta: 0.68, week52High: 1150, week52Low: 650, volume: 2400000, about: "Diversified pharmaceutical company with global generics reach." },
  { symbol: "BIOCON", name: "Biocon", sector: "Pharma", basePrice: 340.00, marketCap: 40800, peRatio: 68.4, dividendYield: 0.3, eps: 5.0, beta: 0.82, week52High: 420, week52Low: 250, volume: 5200000, about: "Biopharmaceutical company focused on biosimilars." },
  { symbol: "GLENMARK", name: "Glenmark Pharmaceuticals", sector: "Pharma", basePrice: 1450.00, marketCap: 40800, peRatio: 24.6, dividendYield: 0.6, eps: 58.9, beta: 0.85, week52High: 1850, week52Low: 950, volume: 1600000, about: "Research-driven pharmaceutical company, strong in dermatology." },
  { symbol: "LAURUSLABS", name: "Laurus Labs", sector: "Pharma", basePrice: 575.00, marketCap: 30800, peRatio: 78.2, dividendYield: 0.2, eps: 7.4, beta: 1.05, week52High: 720, week52Low: 380, volume: 3400000, about: "API and generics manufacturer, strong in antiretrovirals." },
  { symbol: "IPCALAB", name: "Ipca Laboratories", sector: "Pharma", basePrice: 1460.00, marketCap: 37000, peRatio: 42.6, dividendYield: 0.5, eps: 34.3, beta: 0.62, week52High: 1780, week52Low: 1050, volume: 480000, about: "Formulations and API manufacturer, strong in anti-malarials." },
  { symbol: "ABBOTINDIA", name: "Abbott India", sector: "Pharma", basePrice: 29500.00, marketCap: 62700, peRatio: 48.2, dividendYield: 1.1, eps: 612.0, beta: 0.45, week52High: 33500, week52Low: 24000, volume: 25000, about: "Indian subsidiary of Abbott Laboratories." },
  { symbol: "PFIZER", name: "Pfizer Limited", sector: "Pharma", basePrice: 4650.00, marketCap: 59700, peRatio: 42.8, dividendYield: 1.9, eps: 108.7, beta: 0.38, week52High: 5400, week52Low: 3800, volume: 45000, about: "Indian subsidiary of the global pharma major Pfizer." },
  { symbol: "MANKIND", name: "Mankind Pharma", sector: "Pharma", basePrice: 2600.00, marketCap: 104300, peRatio: 44.2, dividendYield: 0.3, eps: 58.8, beta: 0.70, week52High: 3000, week52Low: 1800, volume: 620000, about: "Domestic-focused pharma company known for consumer health brands." },
  { symbol: "FORTIS", name: "Fortis Healthcare", sector: "Healthcare", basePrice: 625.00, marketCap: 46200, peRatio: 62.4, dividendYield: 0.2, eps: 10.0, beta: 0.72, week52High: 780, week52Low: 420, volume: 2100000, about: "Multi-specialty hospital chain across India." },
  { symbol: "MAXHEALTH", name: "Max Healthcare Institute", sector: "Healthcare", basePrice: 1060.00, marketCap: 103000, peRatio: 68.2, dividendYield: 0.1, eps: 15.5, beta: 0.68, week52High: 1250, week52Low: 700, volume: 1600000, about: "Premium hospital chain concentrated in North India." },
  { symbol: "METROPOLIS", name: "Metropolis Healthcare", sector: "Healthcare", basePrice: 1950.00, marketCap: 9900, peRatio: 58.4, dividendYield: 0.4, eps: 33.4, beta: 0.65, week52High: 2300, week52Low: 1450, volume: 220000, about: "Diagnostic chain offering pathology and lab testing services." },
  { symbol: "LALPATHLAB", name: "Dr Lal PathLabs", sector: "Healthcare", basePrice: 3080.00, marketCap: 25700, peRatio: 62.8, dividendYield: 0.5, eps: 49.0, beta: 0.58, week52High: 3600, week52Low: 2200, volume: 280000, about: "One of India's largest diagnostic chains." },
  { symbol: "NARAYANHRUD", name: "Narayana Hrudayalaya", sector: "Healthcare", basePrice: 1420.00, marketCap: 29200, peRatio: 42.6, dividendYield: 0.3, eps: 33.3, beta: 0.62, week52High: 1700, week52Low: 950, volume: 380000, about: "Multi-specialty hospital chain founded by Dr Devi Shetty." },

  // --- FMCG & Consumer ---
  { symbol: "DABUR", name: "Dabur India", sector: "FMCG", basePrice: 545.00, marketCap: 96500, peRatio: 44.8, dividendYield: 1.5, eps: 12.2, beta: 0.42, week52High: 680, week52Low: 460, volume: 3400000, about: "Ayurvedic and natural consumer products company." },
  { symbol: "GODREJCP", name: "Godrej Consumer Products", sector: "FMCG", basePrice: 1190.00, marketCap: 121700, peRatio: 52.6, dividendYield: 0.9, eps: 22.6, beta: 0.48, week52High: 1500, week52Low: 950, volume: 1800000, about: "FMCG company known for soaps, hair care and home care." },
  { symbol: "MARICO", name: "Marico Limited", sector: "FMCG", basePrice: 620.00, marketCap: 80100, peRatio: 48.2, dividendYield: 1.4, eps: 12.9, beta: 0.38, week52High: 720, week52Low: 480, volume: 2800000, about: "FMCG major behind Parachute, Saffola and Livon." },
  { symbol: "COLPAL", name: "Colgate-Palmolive India", sector: "FMCG", basePrice: 2780.00, marketCap: 75600, peRatio: 42.4, dividendYield: 2.1, eps: 65.6, beta: 0.35, week52High: 3400, week52Low: 2200, volume: 480000, about: "Indian subsidiary of the global oral care major." },
  { symbol: "VBL", name: "Varun Beverages", sector: "FMCG", basePrice: 575.00, marketCap: 224000, peRatio: 68.4, dividendYield: 0.2, eps: 8.4, beta: 0.65, week52High: 720, week52Low: 480, volume: 4200000, about: "PepsiCo's largest bottling partner outside the US." },
  { symbol: "UBL", name: "United Breweries", sector: "FMCG", basePrice: 1950.00, marketCap: 51600, peRatio: 78.2, dividendYield: 0.3, eps: 24.9, beta: 0.55, week52High: 2350, week52Low: 1550, volume: 380000, about: "India's largest beer company, maker of Kingfisher." },
  { symbol: "RADICO", name: "Radico Khaitan", sector: "FMCG", basePrice: 1980.00, marketCap: 26500, peRatio: 88.4, dividendYield: 0.2, eps: 22.4, beta: 0.72, week52High: 2600, week52Low: 1450, volume: 620000, about: "Premium Indian-made foreign liquor manufacturer." },
  { symbol: "EMAMILTD", name: "Emami Limited", sector: "FMCG", basePrice: 680.00, marketCap: 30600, peRatio: 34.2, dividendYield: 1.8, eps: 19.9, beta: 0.52, week52High: 850, week52Low: 520, volume: 1400000, about: "FMCG company known for Navratna, Boroplus and Zandu." },
  { symbol: "PGHH", name: "Procter & Gamble Hygiene", sector: "FMCG", basePrice: 15500.00, marketCap: 50300, peRatio: 58.4, dividendYield: 1.4, eps: 265.4, beta: 0.32, week52High: 18500, week52Low: 13200, volume: 15000, about: "Indian listed arm of P&G, known for Whisper and Vicks." },
  { symbol: "GILLETTE", name: "Gillette India", sector: "FMCG", basePrice: 9200.00, marketCap: 29900, peRatio: 62.8, dividendYield: 1.0, eps: 146.5, beta: 0.30, week52High: 11500, week52Low: 7200, volume: 8000, about: "Personal grooming products, Indian arm of P&G's Gillette." },
  { symbol: "JYOTHYLAB", name: "Jyothy Labs", sector: "FMCG", basePrice: 435.00, marketCap: 15100, peRatio: 42.6, dividendYield: 1.3, eps: 10.2, beta: 0.58, week52High: 550, week52Low: 320, volume: 1100000, about: "FMCG company known for Ujala, Exo and Margo brands." },
  { symbol: "BAJAJCON", name: "Bajaj Consumer Care", sector: "FMCG", basePrice: 240.00, marketCap: 3500, peRatio: 18.4, dividendYield: 4.2, eps: 13.0, beta: 0.62, week52High: 300, week52Low: 190, volume: 380000, about: "FMCG company known for Bajaj Almond Drops hair oil." },

  // --- Energy, Oil & Gas, Power ---
  { symbol: "IOC", name: "Indian Oil Corporation", sector: "Energy", basePrice: 142.00, marketCap: 200000, peRatio: 8.4, dividendYield: 6.8, eps: 16.9, beta: 1.10, week52High: 195, week52Low: 105, volume: 24000000, about: "India's largest oil refining and marketing PSU." },
  { symbol: "GAIL", name: "GAIL India", sector: "Energy", basePrice: 198.00, marketCap: 130000, peRatio: 10.8, dividendYield: 3.1, eps: 18.3, beta: 1.02, week52High: 250, week52Low: 155, volume: 12400000, about: "India's largest natural gas transmission and marketing company." },
  { symbol: "PETRONET", name: "Petronet LNG", sector: "Energy", basePrice: 320.00, marketCap: 48000, peRatio: 12.6, dividendYield: 4.8, eps: 25.4, beta: 0.85, week52High: 380, week52Low: 220, volume: 4200000, about: "Operator of India's largest LNG import terminals." },
  { symbol: "IGL", name: "Indraprastha Gas", sector: "Energy", basePrice: 440.00, marketCap: 30800, peRatio: 18.2, dividendYield: 2.6, eps: 24.2, beta: 0.78, week52High: 550, week52Low: 340, volume: 2600000, about: "City gas distribution company for the Delhi NCR region." },
  { symbol: "MGL", name: "Mahanagar Gas", sector: "Energy", basePrice: 1350.00, marketCap: 13300, peRatio: 12.4, dividendYield: 3.8, eps: 108.9, beta: 0.75, week52High: 1850, week52Low: 1100, volume: 480000, about: "City gas distribution company for Mumbai region." },
  { symbol: "ADANIGREEN", name: "Adani Green Energy", sector: "Power", basePrice: 1050.00, marketCap: 166000, peRatio: 88.4, dividendYield: 0.0, eps: 11.9, beta: 1.68, week52High: 2175, week52Low: 780, volume: 3200000, about: "Renewable energy generation arm of the Adani Group." },
  { symbol: "ADANIPOWER", name: "Adani Power", sector: "Power", basePrice: 520.00, marketCap: 200000, peRatio: 14.2, dividendYield: 0.0, eps: 36.6, beta: 1.55, week52High: 895, week52Low: 380, volume: 6200000, about: "India's largest private thermal power producer." },
  { symbol: "ADANIENSOL", name: "Adani Energy Solutions", sector: "Power", basePrice: 820.00, marketCap: 94500, peRatio: 108.6, dividendYield: 0.0, eps: 7.6, beta: 1.62, week52High: 1348, week52Low: 500, volume: 2100000, about: "Power transmission and distribution arm of the Adani Group." },
  { symbol: "TATAPOWER", name: "Tata Power", sector: "Power", basePrice: 412.00, marketCap: 131700, peRatio: 32.6, dividendYield: 0.4, eps: 12.6, beta: 1.28, week52High: 495, week52Low: 320, volume: 8400000, about: "Integrated power company spanning generation to distribution." },
  { symbol: "NHPC", name: "NHPC Limited", sector: "Power", basePrice: 92.00, marketCap: 92700, peRatio: 24.8, dividendYield: 2.2, eps: 3.7, beta: 0.95, week52High: 118, week52Low: 68, volume: 22000000, about: "State-owned hydropower generation company." },
  { symbol: "SJVN", name: "SJVN Limited", sector: "Power", basePrice: 115.00, marketCap: 45100, peRatio: 32.4, dividendYield: 1.8, eps: 3.5, beta: 1.05, week52High: 150, week52Low: 78, volume: 14000000, about: "State-owned hydro and renewable power generation company." },
  { symbol: "TORNTPOWER", name: "Torrent Power", sector: "Power", basePrice: 1540.00, marketCap: 74000, peRatio: 32.8, dividendYield: 0.9, eps: 47.0, beta: 0.92, week52High: 1950, week52Low: 1050, volume: 480000, about: "Integrated power utility across Gujarat and other states." },
  { symbol: "JSWENERGY", name: "JSW Energy", sector: "Power", basePrice: 615.00, marketCap: 108000, peRatio: 42.6, dividendYield: 0.4, eps: 14.4, beta: 1.22, week52High: 780, week52Low: 420, volume: 3400000, about: "Power generation company under the JSW Group." },
  { symbol: "CESC", name: "CESC Limited", sector: "Power", basePrice: 155.00, marketCap: 20400, peRatio: 12.8, dividendYield: 2.6, eps: 12.1, beta: 0.88, week52High: 210, week52Low: 130, volume: 2200000, about: "Integrated power utility serving Kolkata and other regions." },

  // --- Metals & Mining ---
  { symbol: "VEDL", name: "Vedanta Limited", sector: "Metals", basePrice: 455.00, marketCap: 169000, peRatio: 16.8, dividendYield: 6.2, eps: 27.1, beta: 1.42, week52High: 530, week52Low: 320, volume: 14000000, about: "Diversified natural resources company — zinc, oil, aluminium." },
  { symbol: "NMDC", name: "NMDC Limited", sector: "Metals", basePrice: 218.00, marketCap: 64000, peRatio: 10.4, dividendYield: 4.2, eps: 21.0, beta: 1.18, week52High: 285, week52Low: 165, volume: 8400000, about: "India's largest iron ore producer, state-owned." },
  { symbol: "JINDALSTEL", name: "Jindal Steel & Power", sector: "Metals", basePrice: 975.00, marketCap: 99400, peRatio: 20.4, dividendYield: 0.2, eps: 47.8, beta: 1.35, week52High: 1150, week52Low: 620, volume: 4200000, about: "Steel and power producer from the O.P. Jindal Group." },
  { symbol: "SAIL", name: "Steel Authority of India", sector: "Metals", basePrice: 128.00, marketCap: 52800, peRatio: 22.6, dividendYield: 1.6, eps: 5.7, beta: 1.32, week52High: 175, week52Low: 95, volume: 18000000, about: "State-owned integrated steel producer." },
  { symbol: "NATIONALUM", name: "National Aluminium Company", sector: "Metals", basePrice: 190.00, marketCap: 34900, peRatio: 12.8, dividendYield: 2.4, eps: 14.8, beta: 1.28, week52High: 245, week52Low: 130, volume: 9800000, about: "State-owned aluminium producer and exporter." },
  { symbol: "HINDZINC", name: "Hindustan Zinc", sector: "Metals", basePrice: 465.00, marketCap: 196700, peRatio: 20.2, dividendYield: 5.8, eps: 23.0, beta: 0.98, week52High: 780, week52Low: 380, volume: 3200000, about: "World's second-largest zinc producer, Vedanta Group." },
  { symbol: "RATNAMANI", name: "Ratnamani Metals & Tubes", sector: "Metals", basePrice: 3400.00, marketCap: 23800, peRatio: 44.6, dividendYield: 0.4, eps: 76.2, beta: 0.95, week52High: 4200, week52Low: 2200, volume: 90000, about: "Manufacturer of stainless steel and carbon steel pipes." },
  { symbol: "APLAPOLLO", name: "APL Apollo Tubes", sector: "Metals", basePrice: 1550.00, marketCap: 43000, peRatio: 52.4, dividendYield: 0.2, eps: 29.6, beta: 1.02, week52High: 1900, week52Low: 1200, volume: 480000, about: "India's largest structural steel tube manufacturer." },

  // --- Cement ---
  { symbol: "SHREECEM", name: "Shree Cement", sector: "Cement", basePrice: 26500.00, marketCap: 95600, peRatio: 42.8, dividendYield: 0.4, eps: 619.0, beta: 0.82, week52High: 32000, week52Low: 21500, volume: 25000, about: "One of India's largest cement manufacturers by capacity." },
  { symbol: "AMBUJACEM", name: "Ambuja Cements", sector: "Cement", basePrice: 585.00, marketCap: 144200, peRatio: 32.6, dividendYield: 0.7, eps: 17.9, beta: 0.92, week52High: 720, week52Low: 420, volume: 5200000, about: "Cement major, part of the Adani Group." },
  { symbol: "ACC", name: "ACC Limited", sector: "Cement", basePrice: 2250.00, marketCap: 42200, peRatio: 24.8, dividendYield: 1.2, eps: 90.7, beta: 0.88, week52High: 2680, week52Low: 1800, volume: 480000, about: "Cement manufacturer, part of the Adani-owned Ambuja Group." },
  { symbol: "DALBHARAT", name: "Dalmia Bharat", sector: "Cement", basePrice: 2050.00, marketCap: 38400, peRatio: 44.6, dividendYield: 0.4, eps: 46.0, beta: 0.95, week52High: 2450, week52Low: 1550, volume: 320000, about: "Major cement producer with strong presence in East India." },
  { symbol: "JKCEMENT", name: "JK Cement", sector: "Cement", basePrice: 4280.00, marketCap: 33400, peRatio: 42.6, dividendYield: 0.3, eps: 100.5, beta: 0.98, week52High: 5400, week52Low: 3200, volume: 220000, about: "Grey and white cement manufacturer from the JK Group." },
  { symbol: "RAMCOCEM", name: "The Ramco Cements", sector: "Cement", basePrice: 970.00, marketCap: 22900, peRatio: 38.2, dividendYield: 0.6, eps: 25.4, beta: 0.85, week52High: 1150, week52Low: 750, volume: 480000, about: "South India-focused cement manufacturer." },

  // --- Capital Goods, Infra & Defence ---
  { symbol: "SIEMENS", name: "Siemens Limited", sector: "Infra", basePrice: 6650.00, marketCap: 236700, peRatio: 68.4, dividendYield: 0.3, eps: 97.2, beta: 0.92, week52High: 8500, week52Low: 5200, volume: 320000, about: "Indian arm of Siemens AG — automation, power and mobility." },
  { symbol: "ABB", name: "ABB India", sector: "Infra", basePrice: 6700.00, marketCap: 142100, peRatio: 78.2, dividendYield: 0.4, eps: 85.7, beta: 0.90, week52High: 9200, week52Low: 5400, volume: 180000, about: "Indian arm of ABB Group — electrification and automation." },
  { symbol: "CUMMINSIND", name: "Cummins India", sector: "Infra", basePrice: 3400.00, marketCap: 94200, peRatio: 46.8, dividendYield: 1.2, eps: 72.6, beta: 0.95, week52High: 4200, week52Low: 2600, volume: 380000, about: "Engine and power generation equipment manufacturer." },
  { symbol: "HAVELLS", name: "Havells India", sector: "Consumer", basePrice: 1740.00, marketCap: 109000, peRatio: 62.4, dividendYield: 0.7, eps: 27.9, beta: 0.85, week52High: 2100, week52Low: 1350, volume: 1400000, about: "Electrical equipment and consumer durables manufacturer." },
  { symbol: "VOLTAS", name: "Voltas Limited", sector: "Consumer", basePrice: 1650.00, marketCap: 54700, peRatio: 58.6, dividendYield: 0.5, eps: 28.2, beta: 1.15, week52High: 2100, week52Low: 1150, volume: 1200000, about: "India's largest air conditioning and cooling appliances brand." },
  { symbol: "BLUESTARCO", name: "Blue Star Limited", sector: "Consumer", basePrice: 1930.00, marketCap: 20700, peRatio: 52.8, dividendYield: 0.4, eps: 36.6, beta: 1.02, week52High: 2350, week52Low: 1350, volume: 480000, about: "Air conditioning and commercial refrigeration company." },
  { symbol: "CGPOWER", name: "CG Power and Industrial Solutions", sector: "Infra", basePrice: 720.00, marketCap: 110900, peRatio: 78.6, dividendYield: 0.3, eps: 9.2, beta: 1.28, week52High: 900, week52Low: 480, volume: 3400000, about: "Power transmission and industrial equipment manufacturer." },
  { symbol: "THERMAX", name: "Thermax Limited", sector: "Infra", basePrice: 4650.00, marketCap: 55400, peRatio: 62.4, dividendYield: 0.5, eps: 74.5, beta: 0.98, week52High: 6200, week52Low: 3400, volume: 210000, about: "Energy and environment engineering solutions provider." },
  { symbol: "BEL", name: "Bharat Electronics", sector: "Defence", basePrice: 310.00, marketCap: 226900, peRatio: 46.8, dividendYield: 1.4, eps: 6.6, beta: 1.05, week52High: 340, week52Low: 180, volume: 18000000, about: "State-owned defence electronics and radar manufacturer." },
  { symbol: "HAL", name: "Hindustan Aeronautics", sector: "Defence", basePrice: 4650.00, marketCap: 310800, peRatio: 34.2, dividendYield: 1.0, eps: 136.0, beta: 1.02, week52High: 5675, week52Low: 3200, volume: 900000, about: "State-owned aerospace and defence manufacturer." },
  { symbol: "BEML", name: "BEML Limited", sector: "Defence", basePrice: 4100.00, marketCap: 17100, peRatio: 44.6, dividendYield: 0.4, eps: 91.9, beta: 1.18, week52High: 5400, week52Low: 2800, volume: 180000, about: "State-owned manufacturer of earthmoving, rail and defence equipment." },
  { symbol: "BHEL", name: "Bharat Heavy Electricals", sector: "Infra", basePrice: 260.00, marketCap: 90500, peRatio: 108.4, dividendYield: 0.0, eps: 2.4, beta: 1.42, week52High: 340, week52Low: 165, volume: 22000000, about: "State-owned power plant equipment manufacturer." },
  { symbol: "IRCTC", name: "Indian Railway Catering & Tourism Corp", sector: "Infra", basePrice: 950.00, marketCap: 76000, peRatio: 58.2, dividendYield: 0.7, eps: 16.3, beta: 0.85, week52High: 1150, week52Low: 650, volume: 2400000, about: "Monopoly provider of railway catering, tourism and ticketing." },
  { symbol: "CONCOR", name: "Container Corporation of India", sector: "Infra", basePrice: 920.00, marketCap: 56100, peRatio: 38.4, dividendYield: 1.1, eps: 24.0, beta: 0.98, week52High: 1150, week52Low: 650, volume: 1800000, about: "State-owned container logistics and rail freight company." },
  { symbol: "GMRINFRA", name: "GMR Airports Infrastructure", sector: "Infra", basePrice: 95.00, marketCap: 55700, peRatio: 0, dividendYield: 0.0, eps: -0.8, beta: 1.32, week52High: 118, week52Low: 68, volume: 24000000, about: "Airport infrastructure operator — Delhi and Hyderabad airports." },
  { symbol: "NBCC", name: "NBCC (India)", sector: "Infra", basePrice: 115.00, marketCap: 31700, peRatio: 44.2, dividendYield: 1.2, eps: 2.6, beta: 1.28, week52High: 165, week52Low: 65, volume: 22000000, about: "State-owned real estate and construction PSU." },
  { symbol: "RVNL", name: "Rail Vikas Nigam", sector: "Infra", basePrice: 520.00, marketCap: 108500, peRatio: 62.8, dividendYield: 0.5, eps: 8.3, beta: 1.45, week52High: 650, week52Low: 280, volume: 12000000, about: "State-owned railway infrastructure construction company." },
  { symbol: "IRFC", name: "Indian Railway Finance Corp", sector: "Finance", basePrice: 158.00, marketCap: 206500, peRatio: 30.6, dividendYield: 1.3, eps: 5.2, beta: 1.15, week52High: 230, week52Low: 108, volume: 28000000, about: "State-owned financing arm for Indian Railways." },
  { symbol: "RAILTEL", name: "RailTel Corporation of India", sector: "Telecom", basePrice: 390.00, marketCap: 12900, peRatio: 42.6, dividendYield: 0.6, eps: 9.2, beta: 1.10, week52High: 480, week52Low: 250, volume: 1800000, about: "Railway-owned telecom infrastructure provider." },

  // --- Telecom ---
  { symbol: "IDEA", name: "Vodafone Idea", sector: "Telecom", basePrice: 13.50, marketCap: 62900, peRatio: 0, dividendYield: 0.0, eps: -2.1, beta: 1.85, week52High: 19, week52Low: 6, volume: 380000000, about: "Telecom operator formed from the Vodafone-Idea merger." },
  { symbol: "INDUSTOWER", name: "Indus Towers", sector: "Telecom", basePrice: 385.00, marketCap: 103400, peRatio: 14.8, dividendYield: 2.6, eps: 26.0, beta: 1.15, week52High: 450, week52Low: 240, volume: 4200000, about: "Largest telecom tower infrastructure company in India." },

  // --- Realty ---
  { symbol: "DLF", name: "DLF Limited", sector: "Realty", basePrice: 820.00, marketCap: 203000, peRatio: 42.8, dividendYield: 0.5, eps: 19.2, beta: 1.28, week52High: 990, week52Low: 620, volume: 4200000, about: "India's largest listed real estate developer." },
  { symbol: "GODREJPROP", name: "Godrej Properties", sector: "Realty", basePrice: 2700.00, marketCap: 82600, peRatio: 44.6, dividendYield: 0.1, eps: 60.5, beta: 1.35, week52High: 3400, week52Low: 2000, volume: 900000, about: "Real estate developer under the Godrej Group." },
  { symbol: "OBEROIRLTY", name: "Oberoi Realty", sector: "Realty", basePrice: 1750.00, marketCap: 63700, peRatio: 28.4, dividendYield: 0.2, eps: 61.6, beta: 1.22, week52High: 2200, week52Low: 1350, volume: 1100000, about: "Premium real estate developer focused on Mumbai." },
  { symbol: "PRESTIGE", name: "Prestige Estates Projects", sector: "Realty", basePrice: 1750.00, marketCap: 71800, peRatio: 52.6, dividendYield: 0.2, eps: 33.3, beta: 1.30, week52High: 2150, week52Low: 1250, volume: 1400000, about: "Bengaluru-headquartered real estate developer." },
  { symbol: "PHOENIXLTD", name: "Phoenix Mills", sector: "Realty", basePrice: 1720.00, marketCap: 62200, peRatio: 46.8, dividendYield: 0.3, eps: 36.8, beta: 1.15, week52High: 2050, week52Low: 1250, volume: 480000, about: "Retail-led real estate developer, owner of major mall chains." },
  { symbol: "LODHA", name: "Macrotech Developers (Lodha)", sector: "Realty", basePrice: 1250.00, marketCap: 124800, peRatio: 48.2, dividendYield: 0.2, eps: 25.9, beta: 1.38, week52High: 1650, week52Low: 950, volume: 1800000, about: "Mumbai-based real estate developer operating as Lodha." },

  // --- Retail & Consumer Discretionary ---
  { symbol: "DMART", name: "Avenue Supermarts (DMart)", sector: "Retail", basePrice: 3950.00, marketCap: 256900, peRatio: 78.4, dividendYield: 0.0, eps: 50.4, beta: 0.75, week52High: 5484, week52Low: 3200, volume: 480000, about: "Value retail supermarket chain, one of India's most valuable retailers." },
  { symbol: "TRENT", name: "Trent Limited", sector: "Retail", basePrice: 5800.00, marketCap: 205900, peRatio: 118.4, dividendYield: 0.1, eps: 49.0, beta: 1.15, week52High: 8345, week52Low: 3900, volume: 620000, about: "Tata Group fashion retailer behind Westside and Zudio." },
  { symbol: "ABFRL", name: "Aditya Birla Fashion and Retail", sector: "Retail", basePrice: 285.00, marketCap: 20500, peRatio: 0, dividendYield: 0.0, eps: -2.4, beta: 1.28, week52High: 340, week52Low: 180, volume: 4200000, about: "Fashion retail conglomerate — Pantaloons, Van Heusen and more." },
  { symbol: "PAGEIND", name: "Page Industries (Jockey)", sector: "Retail", basePrice: 38500.00, marketCap: 43000, peRatio: 62.8, dividendYield: 1.1, eps: 613.0, beta: 0.82, week52High: 48000, week52Low: 32000, volume: 15000, about: "Exclusive licensee of Jockey innerwear in India." },
  { symbol: "RELAXO", name: "Relaxo Footwears", sector: "Retail", basePrice: 720.00, marketCap: 17900, peRatio: 68.4, dividendYield: 0.3, eps: 10.5, beta: 0.88, week52High: 950, week52Low: 550, volume: 620000, about: "India's largest footwear manufacturer by volume." },
  { symbol: "BATAINDIA", name: "Bata India", sector: "Retail", basePrice: 1420.00, marketCap: 18300, peRatio: 52.6, dividendYield: 0.9, eps: 27.0, beta: 0.78, week52High: 1750, week52Low: 1150, volume: 480000, about: "India's largest footwear retailer." },
  { symbol: "VMART", name: "V-Mart Retail", sector: "Retail", basePrice: 2950.00, marketCap: 4500, peRatio: 88.4, dividendYield: 0.0, eps: 33.4, beta: 1.05, week52High: 3800, week52Low: 1950, volume: 140000, about: "Value fashion retail chain in Tier 2/3 India." },
  { symbol: "SHOPERSTOP", name: "Shoppers Stop", sector: "Retail", basePrice: 720.00, marketCap: 6500, peRatio: 0, dividendYield: 0.0, eps: -1.2, beta: 1.02, week52High: 900, week52Low: 550, volume: 380000, about: "Department store chain for apparel and lifestyle products." },

  // --- Media & Entertainment ---
  { symbol: "ZEEL", name: "Zee Entertainment Enterprises", sector: "Media", basePrice: 128.00, marketCap: 12300, peRatio: 0, dividendYield: 0.0, eps: -1.8, beta: 1.42, week52High: 175, week52Low: 85, volume: 12000000, about: "Media and broadcasting company with a large TV network." },
  { symbol: "SUNTV", name: "Sun TV Network", sector: "Media", basePrice: 620.00, marketCap: 24400, peRatio: 15.8, dividendYield: 4.2, eps: 39.2, beta: 0.85, week52High: 780, week52Low: 480, volume: 1400000, about: "South India-focused broadcaster and media company." },
  { symbol: "PVRINOX", name: "PVR INOX", sector: "Media", basePrice: 1350.00, marketCap: 18100, peRatio: 0, dividendYield: 0.0, eps: -12.4, beta: 1.35, week52High: 1750, week52Low: 950, volume: 480000, about: "India's largest multiplex cinema chain." },
  { symbol: "NETWORK18", name: "Network18 Media & Investments", sector: "Media", basePrice: 75.00, marketCap: 14600, peRatio: 0, dividendYield: 0.0, eps: -1.1, beta: 1.48, week52High: 105, week52Low: 45, volume: 2600000, about: "Media conglomerate under the Reliance-Network18 group." },

  // --- Chemicals ---
  { symbol: "PIDILITIND", name: "Pidilite Industries", sector: "Chemicals", basePrice: 3000.00, marketCap: 152600, peRatio: 68.4, dividendYield: 0.6, eps: 43.9, beta: 0.55, week52High: 3400, week52Low: 2450, volume: 620000, about: "India's leading adhesives and specialty chemicals company (Fevicol)." },
  { symbol: "SRF", name: "SRF Limited", sector: "Chemicals", basePrice: 2500.00, marketCap: 74200, peRatio: 58.4, dividendYield: 0.4, eps: 42.8, beta: 0.98, week52High: 2900, week52Low: 2000, volume: 480000, about: "Diversified chemicals company — fluorochemicals, packaging films." },
  { symbol: "DEEPAKNTR", name: "Deepak Nitrite", sector: "Chemicals", basePrice: 2300.00, marketCap: 31400, peRatio: 42.6, dividendYield: 0.3, eps: 54.0, beta: 1.05, week52High: 2900, week52Low: 1850, volume: 480000, about: "Specialty and performance chemicals manufacturer." },
  { symbol: "UPL", name: "UPL Limited", sector: "Chemicals", basePrice: 570.00, marketCap: 43300, peRatio: 0, dividendYield: 1.2, eps: -3.5, beta: 1.15, week52High: 720, week52Low: 420, volume: 4200000, about: "Global agrochemicals and crop protection company." },
  { symbol: "PIIND", name: "PI Industries", sector: "Chemicals", basePrice: 3800.00, marketCap: 57700, peRatio: 32.6, dividendYield: 0.3, eps: 116.6, beta: 0.85, week52High: 4500, week52Low: 3200, volume: 380000, about: "Agrochemicals and custom synthesis manufacturer." },
  { symbol: "AARTIIND", name: "Aarti Industries", sector: "Chemicals", basePrice: 665.00, marketCap: 24500, peRatio: 48.2, dividendYield: 0.6, eps: 13.8, beta: 1.12, week52High: 850, week52Low: 420, volume: 2100000, about: "Specialty chemicals manufacturer serving pharma and agro sectors." },
  { symbol: "NAVINFLUOR", name: "Navin Fluorine International", sector: "Chemicals", basePrice: 4350.00, marketCap: 21600, peRatio: 58.4, dividendYield: 0.4, eps: 74.5, beta: 0.92, week52High: 5400, week52Low: 3200, volume: 180000, about: "Fluorochemicals manufacturer, part of the Arvind Mafatlal Group." },
  { symbol: "ATUL", name: "Atul Limited", sector: "Chemicals", basePrice: 7200.00, marketCap: 21200, peRatio: 44.6, dividendYield: 0.6, eps: 161.4, beta: 0.78, week52High: 8800, week52Low: 5800, volume: 45000, about: "Diversified specialty and bulk chemicals manufacturer." },
  { symbol: "TATACHEM", name: "Tata Chemicals", sector: "Chemicals", basePrice: 1080.00, marketCap: 27500, peRatio: 0, dividendYield: 1.4, eps: -8.2, beta: 1.02, week52High: 1250, week52Low: 800, volume: 1400000, about: "Soda ash and specialty chemicals producer, part of Tata Group." },
  { symbol: "GNFC", name: "Gujarat Narmada Valley Fertilizers", sector: "Chemicals", basePrice: 620.00, marketCap: 10200, peRatio: 12.6, dividendYield: 2.8, eps: 49.2, beta: 0.95, week52High: 780, week52Low: 480, volume: 900000, about: "State-owned fertilizer and chemicals manufacturer." },
  { symbol: "COROMANDEL", name: "Coromandel International", sector: "Chemicals", basePrice: 1450.00, marketCap: 42900, peRatio: 22.4, dividendYield: 1.2, eps: 64.7, beta: 0.72, week52High: 1850, week52Low: 1050, volume: 480000, about: "Fertilizers and crop protection company, Murugappa Group." },

  // --- Airlines, Logistics & Textiles ---
  { symbol: "INDIGO", name: "InterGlobe Aviation (IndiGo)", sector: "Airlines", basePrice: 4050.00, marketCap: 156300, peRatio: 24.6, dividendYield: 0.4, eps: 164.6, beta: 1.05, week52High: 5060, week52Low: 3200, volume: 1200000, about: "India's largest airline by passenger market share." },
  { symbol: "BLUEDART", name: "Blue Dart Express", sector: "Infra", basePrice: 6800.00, marketCap: 16200, peRatio: 42.8, dividendYield: 1.2, eps: 158.9, beta: 0.68, week52High: 8500, week52Low: 5400, volume: 25000, about: "India's leading express air and ground logistics company." },
  { symbol: "TRIDENT", name: "Trident Limited", sector: "Textiles", basePrice: 38.00, marketCap: 18800, peRatio: 42.6, dividendYield: 1.8, eps: 0.9, beta: 1.15, week52High: 52, week52Low: 28, volume: 22000000, about: "Home textiles and paper manufacturer." },
  { symbol: "WELSPUNIND", name: "Welspun Living", sector: "Textiles", basePrice: 158.00, marketCap: 15600, peRatio: 24.6, dividendYield: 1.4, eps: 6.4, beta: 1.05, week52High: 210, week52Low: 120, volume: 4200000, about: "Home textiles manufacturer, major global bed linen exporter." },
  { symbol: "RAYMOND", name: "Raymond Limited", sector: "Textiles", basePrice: 1950.00, marketCap: 13000, peRatio: 18.4, dividendYield: 0.2, eps: 106.0, beta: 1.22, week52High: 2450, week52Low: 1250, volume: 240000, about: "Textile and apparel conglomerate, iconic Indian menswear brand." },

  // --- New Age / Digital ---
  { symbol: "ZOMATO", name: "Eternal (Zomato)", sector: "New Age", basePrice: 265.00, marketCap: 255000, peRatio: 178.4, dividendYield: 0.0, eps: 1.5, beta: 1.45, week52High: 320, week52Low: 145, volume: 22000000, about: "Food delivery and quick-commerce platform (Blinkit parent)." },
  { symbol: "NYKAA", name: "FSN E-Commerce Ventures (Nykaa)", sector: "New Age", basePrice: 180.00, marketCap: 51600, peRatio: 128.6, dividendYield: 0.0, eps: 1.4, beta: 1.32, week52High: 230, week52Low: 130, volume: 8400000, about: "Beauty and fashion e-commerce platform." },
  { symbol: "DELHIVERY", name: "Delhivery Limited", sector: "New Age", basePrice: 390.00, marketCap: 28700, peRatio: 0, dividendYield: 0.0, eps: -2.1, beta: 1.28, week52High: 480, week52Low: 250, volume: 3400000, about: "Logistics and supply chain services platform." },

  // --- Defence & PSU (continued) ---
  { symbol: "HUDCO", name: "Housing & Urban Development Corp", sector: "Finance", basePrice: 210.00, marketCap: 42100, peRatio: 14.2, dividendYield: 3.2, eps: 14.8, beta: 1.18, week52High: 340, week52Low: 130, volume: 8400000, about: "State-owned housing and urban infrastructure financier." },
  { symbol: "IREDA", name: "Indian Renewable Energy Development Agency", sector: "Finance", basePrice: 210.00, marketCap: 56500, peRatio: 32.6, dividendYield: 0.5, eps: 6.4, beta: 1.42, week52High: 310, week52Low: 130, volume: 18000000, about: "State-owned NBFC financing renewable energy projects." },
  { symbol: "MAZDOCK", name: "Mazagon Dock Shipbuilders", sector: "Defence", basePrice: 4150.00, marketCap: 83500, peRatio: 42.6, dividendYield: 0.6, eps: 97.4, beta: 1.15, week52High: 5900, week52Low: 2800, volume: 620000, about: "State-owned warship and submarine builder." },
  { symbol: "COCHINSHIP", name: "Cochin Shipyard", sector: "Defence", basePrice: 1950.00, marketCap: 51300, peRatio: 38.4, dividendYield: 0.8, eps: 50.8, beta: 1.20, week52High: 2900, week52Low: 1350, volume: 480000, about: "State-owned shipbuilding and ship repair company." },
  { symbol: "GRSE", name: "Garden Reach Shipbuilders & Engineers", sector: "Defence", basePrice: 2100.00, marketCap: 27600, peRatio: 46.8, dividendYield: 0.5, eps: 44.9, beta: 1.25, week52High: 3400, week52Low: 1400, volume: 320000, about: "State-owned warship builder for the Indian Navy." },
  { symbol: "DATAPATTNS", name: "Data Patterns (India)", sector: "Defence", basePrice: 2700.00, marketCap: 12200, peRatio: 58.4, dividendYield: 0.2, eps: 46.2, beta: 1.10, week52High: 3400, week52Low: 1850, volume: 90000, about: "Defence electronics design and manufacturing company." },
  { symbol: "SOLARINDS", name: "Solar Industries India", sector: "Defence", basePrice: 10200.00, marketCap: 92100, peRatio: 78.4, dividendYield: 0.2, eps: 130.1, beta: 0.98, week52High: 13500, week52Low: 6800, volume: 90000, about: "Explosives manufacturer with growing defence ordnance business." },

  // --- Consumer Durables ---
  { symbol: "CROMPTON", name: "Crompton Greaves Consumer Electricals", sector: "Consumer", basePrice: 360.00, marketCap: 22800, peRatio: 32.6, dividendYield: 0.8, eps: 11.0, beta: 0.92, week52High: 450, week52Low: 260, volume: 2400000, about: "Consumer electricals — fans, pumps and lighting." },
  { symbol: "WHIRLPOOL", name: "Whirlpool of India", sector: "Consumer", basePrice: 1450.00, marketCap: 18400, peRatio: 62.4, dividendYield: 0.3, eps: 23.2, beta: 0.85, week52High: 1950, week52Low: 1150, volume: 240000, about: "Home appliances manufacturer, Indian arm of Whirlpool Corp." },
  { symbol: "DIXON", name: "Dixon Technologies", sector: "Consumer", basePrice: 13500.00, marketCap: 80700, peRatio: 118.4, dividendYield: 0.1, eps: 114.0, beta: 1.35, week52High: 19100, week52Low: 8500, volume: 180000, about: "Electronics manufacturing services company (contract manufacturer)." },
  { symbol: "AMBER", name: "Amber Enterprises India", sector: "Consumer", basePrice: 6700.00, marketCap: 15500, peRatio: 88.6, dividendYield: 0.0, eps: 75.6, beta: 1.28, week52High: 8500, week52Low: 3400, volume: 90000, about: "Air conditioner and electronics contract manufacturer." },
  { symbol: "KAYNES", name: "Kaynes Technology India", sector: "Consumer", basePrice: 5700.00, marketCap: 30000, peRatio: 98.4, dividendYield: 0.0, eps: 57.9, beta: 1.32, week52High: 7600, week52Low: 2900, volume: 180000, about: "Electronics manufacturing services and IoT solutions company." },
  { symbol: "POLYCAB", name: "Polycab India", sector: "Consumer", basePrice: 6650.00, marketCap: 100000, peRatio: 42.6, dividendYield: 0.7, eps: 156.1, beta: 1.05, week52High: 7600, week52Low: 4800, volume: 380000, about: "India's largest wires and cables manufacturer." },
  { symbol: "KEI", name: "KEI Industries", sector: "Consumer", basePrice: 3850.00, marketCap: 34900, peRatio: 52.4, dividendYield: 0.2, eps: 73.5, beta: 1.02, week52High: 4900, week52Low: 2900, volume: 240000, about: "Wires and cables manufacturer with EPC operations." },
];

export const SECTORS = [
  "Banking", "IT", "Energy", "Auto", "FMCG", "Pharma", "Infra",
  "Telecom", "Power", "Metals", "Finance", "Cement", "Insurance",
  "Healthcare", "Paints", "Consumer", "Realty", "Media", "Chemicals",
  "Retail", "Defence", "Textiles", "New Age", "Airlines",
];

export const INDICES = [
  { symbol: "NIFTY50", name: "Nifty 50", base: 23898, range: 250 },
  { symbol: "SENSEX", name: "Sensex", base: 76664, range: 700 },
  { symbol: "BANKNIFTY", name: "Nifty Bank", base: 53072, range: 380 },
  { symbol: "NIFTYIT", name: "Nifty IT", base: 33160, range: 320 },
  { symbol: "NIFTYAUTO", name: "Nifty Auto", base: 23854, range: 280 },
  { symbol: "NIFTYPHARMA", name: "Nifty Pharma", base: 18420, range: 180 },
];

export const SECTOR_PERFORMANCE: Array<{ sector: string; change: number }> = [
  { sector: "IT", change: 1.42 },
  { sector: "Banking", change: -0.85 },
  { sector: "Auto", change: 2.18 },
  { sector: "Pharma", change: 0.62 },
  { sector: "Energy", change: -1.20 },
  { sector: "FMCG", change: 0.35 },
  { sector: "Metals", change: -2.40 },
  { sector: "Realty", change: 1.05 },
  { sector: "Infra", change: -0.55 },
  { sector: "Telecom", change: 0.88 },
  { sector: "Finance", change: -0.40 },
];

export function getStock(symbol: string) {
  return NIFTY_50.find((s) => s.symbol.toLowerCase() === symbol.toLowerCase());
}

// Deterministic pseudo-random for SSR/CSR consistency
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generatePriceHistory(basePrice: number, days = 30, seed = 1) {
  const points: { date: string; price: number }[] = [];
  const today = new Date();
  let price = basePrice * 0.92;
  for (let i = days; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const noise = (seededRandom(seed + i) - 0.5) * basePrice * 0.018;
    const trend = (basePrice - price) * 0.06;
    price = Math.max(basePrice * 0.7, price + noise + trend);
    points.push({
      date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      price: Math.round(price * 100) / 100,
    });
  }
  return points;
}

export function generateForecast(lastPrice: number, days = 7, seed = 1) {
  const points: { date: string; price: number }[] = [];
  const today = new Date();
  let price = lastPrice;
  const drift = (seededRandom(seed) - 0.5) * 0.012;
  for (let i = 1; i <= days; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const noise = (seededRandom(seed + i + 100) - 0.5) * lastPrice * 0.008;
    price = price * (1 + drift) + noise;
    points.push({
      date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      price: Math.round(price * 100) / 100,
    });
  }
  return points;
}

export function generateIntraday(base: number, points = 78, seed = 1) {
  const out: { time: string; price: number }[] = [];
  let p = base * 0.997;
  const start = new Date();
  start.setHours(9, 15, 0, 0);
  for (let i = 0; i < points; i++) {
    const t = new Date(start.getTime() + i * 5 * 60 * 1000);
    p += (seededRandom(seed + i) - 0.5) * base * 0.0018;
    out.push({
      time: t.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      price: Math.round(p * 100) / 100,
    });
  }
  return out;
}
