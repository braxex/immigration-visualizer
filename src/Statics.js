import React, { Component } from 'react';

export let lprStatics = [
    {
      name: "immediateRelative",
      label: "Immediate Relative",
      title: "Spouses, parents, and minor children (including those being adopted) of US citizens.<br/>Accounts for ≈44.4% of LPRs annually."
    },
    {
      name: "familySponsored",
      label: "Family-Sponsored",
      title: "Unmarried adult children of US citizens and LPRs (and their minor children), as well as immediate relatives of LPRs (spouses, minor children, adult children (and their minor children), and adult siblings (and their minor children)).<br/>Accounts for ≈21.0% of LPRs annually."
    },
    {
      name: "refugeeAsylee",
      label: "Refugee & Asylee",
      title: "Those who have been persecuted or fear they will be persecuted on the basis of race, religion, nationality, and/or membership in a social or political group, as well as their immediate relatives.<br/>Accounts for ≈13.4% of LPRs annually."
    },
    {
      name: "employmentBased",
      label: "Employment-Based",
      title: "Those who emigrate for employment (priority workers, advanced professionals, skilled workers, etc.) and their spouses/minor children.<br/>Accounts for ≈13.6% of LPRs annually."
    },
    {
      name: "diversityLottery",
      label: "Diversity Lottery",
      title: "Those who emigrate to the US from countries with relatively low levels of immigration under the Diversity Immigration Visa Program.<br/>Accounts for ≈4.7% of LPRs annually."
    },
    {
      name: "otherLPR",
      label: "Other",
      title: "Others who qualify as a result of other special legislation extending LPR status to classes of individuals from certain countries and in certain situations.<br/>Accounts for ≈2.9% of LPRs annually."
    }
  ];

  export let niStatics = [
    {
      name: "temporaryVisitor",
      label: "Temporary Visitor",
      title: "Those visiting the US for pleasure (vacation, visiting family/friends, or for medical treatment) or business (attending business meetings and conferences/conventions).<br/>Accounts for ≈90.1% of NIs annually."
    },
    {
      name: "temporaryWorker",
      label: "Temporary Worker",
      title: "Temporary workers/trainees (intracompany transfers, foreign reporters) and their spouses/minor children.<br/>Accounts for ≈3.3% of NIs annually."
    },
    {
      name: "studentExchange",
      label: "Student & Exchange",
      title: "Students and exchange visitors (scholars, physicians, teachers, etc.) and their spouses/minor children.<br/>Accounts for ≈4.8% of NIs annually."
    },
    {
      name: "diplomatRep",
      label: "Diplomat & Representative",
      title: "Diplomats and representatives (ambassadors, public ministers, diplomats, consular officers, and accompanying attendants/personal employees) and their spouses/minor children.<br/>Accounts for ≈0.6% of NIs annually."
    },
    {
      name: "otherNI",
      label: "Other",
      title: "Those in immediate transit through the US, commuter students, fiancé(e)s and spouses of US citizens, etc.<br/>Accounts for ≈1.2% of NIs annually."
    }
  ];

  export let noteStatics = {
    lprMsg: "Lawful permanent residents (LPRs, often referred to as “immigrants” or “green card holders”) are non-citizens who are lawfully authorized to live permanently in the US. LPRs may apply to become US citizens if they meet certain eligibility requirements. LPRs do not include foreign nationals granted temporary admission to the US, such as tourists and temporary workers (including H1B visa holders). Data organized by country of birth.<br/>3-year average: ≈1.08 million/year. <br/> <br/> For more information, visit <a href='https://goo.gl/dN78yY'>https://goo.gl/dN78yY</a>.",
    niMsg: "Nonimmigrants (NIs) are foreign nationals granted temporary admission into the US for reasons including  tourism and business trips, academic/vocational study, temporary employment, and to act as a representative of a foreign government or international organization. NIs are authorized to enter the country for specific purposes and defined periods of time, which are prescribed by their class of admission. Data organized by country of citizenship.<br/>3-year average: ≈76.1 million/year. <br/> <br/> For more information visit <a href='https://goo.gl/LJLYzc'>https://goo.gl/LJLYzc</a>.",
    genMsg: "Data not shown for those with unknown country of birth/origin and for countries where total activity count was less than 10 people. <br/> dw = Data withheld to limit disclosures, per government sources."
  };
