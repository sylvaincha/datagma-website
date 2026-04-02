// Customers page: logo grid loader (Clearbit).

(function () {
  // Provided domains (possibly duplicated or malformed). We'll normalize and de-duplicate.
  const rawDomains = [
    "alyxgod.rf.gd","y.iotf.net","krisatwork.com","intescia.com","getcargo.io","brand-innovators.com","zeliq.com","xpressinternacional.com","orange.com","nextrow.com","krispcall.com","kops-agency.com","greenisland.tech","flipsidegroup.com.au","creativedock.com","cegid.com","BlackLine.com","arthur-hunt.cz","ziphq.com","zelt.app","zelt.apo","zapier.com","zactavenner.com","yourbiz.it","yofitness.fr","yandex.com.tr","yahoo.co.in","xigentsolutions.com","world-way.net","winvesta.in","wink-lab.com","wine-and-passion.com","willinfotech.com","whiteswandata.com","wellstreet.com","weglot.com","webikeo.fr","wake-them-up.com","waixiaoxiao.com","visualping.io","visioglobe.com","virtual-expo.com","viegne.fr","vidizmo.com","vestalhub.com","vem-ltd.com","veetechnologies.com","vcx.solutions","varify.io","vakdor.com","upsilonconsulting.eu","upatch.nl","twenty.com","tugelapeople.com","tsest.com","tryarchitect.com","tripkicks.com","tresilence.com","trazeplus.com","trans.eu","totalgroup.ca","titanbattlegear.com","tipsi.io","tip-berlin.de","tikfraud.com","tigros.io","tianlepaipackaging.com","thrii.com","thinkeo.io","therealdeal.com","theoutpost.com","thementor-solutions.com","theinsightsfamily.com","theconversionmill.com","thebidlab.com","test.com","teramind.co","tenacy.io","tempeos.com","teamjoin.fr","teamecho.com","tcadmin.co.uk","tatarealty.in","systemcrew.com","swapcard.com","surfe.com","superioraluminum.com","stellites.com","stayopen.io","st-hacks.com","sovidigital.com","sonio.ai","social-bee.de","snowlight.io","smbgolf.com","sleepinggiantmedia.co.uk","siscapa.com","signitic.com","siftpro.com","sietz-india.com","sharma.fr","sfi.ca","sevelin.org","sentient.ie","seniortechnologyhelp.com","sendspark.com","sendmarc.com","seiza.co","scsprotect.com","scienceexchange.com","schnellrekrytering.se","schlaf-platz.com","scalizer.fr","salesleadership.ca","rtzen.ai","rodz.io","richard-sons.com","revodyssey.com","reverbico.com","revefi.com","rev-n.com","reseau-talents.fr","repositive.nl","rentacar.fr","remedi.com","recruiter.house","recpeer.com","realtycaptainstrategies.com","random-coffee.com","radiocbs.com","Qualifyze.com","profitableclarity.com","pretto.com","prairiepathmarketing.com","polyphaze.com","polygran.de","polarsignals.com","pmsteele.com.mx","plugilo.com","plrp.fr","pistachioapp.com","piloc.io","picnic.io","performanze.io","peregrineenergysolutions.com","pellenc.com","paytrack.com.br","pathtobrain.org","parasbiopharma.com","pallettrader.com","paiger.co","pageonewebsolutions.com","packsmith.io","oxwork.com","outlook.fr","outlook.com","orbits-oncology.com","opsaiagent.com","openline.ai","oliv.ai","olearis.com","obia.fr","numericoach.fr","nstcyber.ai","nooks.in","nomination.fr","nobelbiz.com","nexttech.ai","neuronux.com","neotrusssystem.dk","nenasal.com","nardoassocaites.com","mygermany.com","mw-concept.com","moontalk.com","moderndca.com","minimercado.net","mindstudio.ai","miitang.com","midlandeurope.com","michaelbrodywaite.com","mgcc.ae","mextor.com","mesaschool.co","mentivis.com","meetings.bio","mdfld.co","manyreach.com","mantralearning.co.uk","manhinggroup.com","makethegrade.fr","lunr.tech","lsssoftware.com","lionize.ai","lillysfreshpasta.com","lifepumpkin.com","librico.fr","leyad.ca","letterhaven.net","letterguard.net","lesbigboss.fr","leeto.co","lebot.in","leadxplore.fr","leads-generation.eu","Kromatic.com","kkvision.de","kenko.fr","kaora-partners.com","kalibrate.com","kajima.com.sg","k3advantage.com","itgma.com","iscsales.com","ircamamplify.com","invox.fr","intercom.com","integral.de","insightdigital.pt","innovatio.fr","inlandinc.com","industrypro.com","incallsystems.com","impala-webstudio.fr","ignyteplatform.com","iden2.com","iddataweb.com","iamrevops.io","iafluence.fr","i3pd.com","hubspot.com","hrtechx.com","hovi.id","homeair.com","heysimon.fr","heyacto.com","hey-julia.de","hexwise.nl","hexagone.colar","helpingyourbusinessgrow.fr","healthvoyagergroup.com","hawkpackaging.com","halawinvest.com","hackodisha.com","gytpol.com","growthtim.com","groupet2mc.fr","groupeprofire.fr","greenkub.fr","grassrootsgrocery.org","goldenbees.fr","gmail.com","globalgroup.co.uk","globaldatabase.com","getsolak.co.uk","getscalability.io","getjuno.co","getcontrast.io","getbadgy.com","get-sidekick.com","geiger.com","gavel.io","gasengineexchange.com","frontlineinc.com","franz-chatelin.com","fowm.io","folk.app","floqer.com","ficep.it","fhpfhp.fr.nf","external.n2f.com","euchv.com","etnetera.cz","eskimoz.fr","erpanalysts.com","entro.security","enrich-crm123578.com","empowill.com","eficode.com","ecole-ipssi.net","dynergie.fr","ds-c.ch","diji.fr","digitaljumpstart.co.uk","devoteam.com","destrier.pl","delen.bank","decidento.com","decadadigital.marketing","debuglab.com","debuggedpro.com","d-a-team.com","cyntegrity.com","cv30.co","ctemc.org","cremedelacreme.io","creditsuite.com","crective.com","cookisbird.om","converteo.com","consultorpro.es","conduction.live","compare8.com","company.com","coheresystems.com","codavatar.tech","clovis.app","cloudify.biz","cloudfiler.io","clique-now.com","clinsher.com","clairecalls.com","churnzero.com","choreograph.com","chatmetrics.com","charmatmethod.com","chargebacks911.com","cbenergyconsultant.com","camphouse.io","calclosets.com","caem.net","c21scheetz.com","bsocial-eg.com","brillianceled.com","brandbuilds.co.za","boom4real.com","bookipi.com","bonx.tech","boldt.com","bluetooth.com","blackhawk11.com","beuncommon247.com","beperpetual.com","bellefondconseil.fr","beedeez.com","bao.jobs","ballyhooboats.com","b2b-2go.com","b-digital.co.il","azuki-consulting.fr","azerty.com","aymenbenali.com","avisi.nl","avento.team","auctionpackages.com","arksentry.com","ariesgroup.it","argenti.com.au","appmore.com","ameripol.us","ambrosworldfoods.com","amariyo-ventures.com","alvaria.com","altifund.com","alternative-search.com","akademiedudigital.com","airsaas.io","aiglesbusiness.com","ahticlimate.com","agicap.com","aghires.com","agence-copernic.fr","ag-projects.fr","aello-group.com","adoptsequence.com","adax.io","adaptive.build","aceandcompany.com","accenture.com","8reach.agecny","7bens.com.br","15963.fr.nf","0cd.cn"
  ];

  const grid = document.getElementById("logo-grid");
  if (!grid) return;

  const normalize = (d) => (d || "").toString().trim().toLowerCase();
  const uniqueDomains = Array.from(new Set(rawDomains.map(normalize).filter(Boolean)));

  const batch = 60; // load in chunks
  let cursor = 0;
  const loadMoreBtn = document.getElementById("load-more");

  function renderNext() {
    const slice = uniqueDomains.slice(cursor, cursor + batch);
    slice.forEach((domain) => {
      const cell = document.createElement("div");
      cell.className = "logo-item";
      const wrapper = document.createElement("div");
      wrapper.className = "flex items-center justify-center";

      const img = document.createElement("img");
      img.className = "logo-img";
      img.alt = domain;
      img.loading = "lazy";
      img.src = `https://logo.clearbit.com/${encodeURIComponent(domain)}?size=128`;

      const fallback = document.createElement("div");
      fallback.className = "logo-fallback";
      fallback.textContent = domain.split(".")[0].slice(0, 10);
      // Hide by default, show on error
      fallback.style.display = "none";

      img.onerror = function () {
        this.style.display = "none";
        fallback.style.display = "flex";
      };

      wrapper.appendChild(img);
      wrapper.appendChild(fallback);
      cell.appendChild(wrapper);
      grid.appendChild(cell);
    });

    cursor += slice.length;
    if (cursor >= uniqueDomains.length && loadMoreBtn) loadMoreBtn.style.display = "none";
  }

  if (loadMoreBtn) loadMoreBtn.addEventListener("click", renderNext);
  renderNext();
})();

