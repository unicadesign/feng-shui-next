/**
 * Izmišljen tlocrt, nacrtan tankim linijama, kao tekstura iza sekcije
 * vebinara na početnoj.
 *
 * Nacrtan je umesto fotografije: fotografija stola sa tlocrtima je pod
 * velom ispadala siva i puna predmeta, a fotografisani arhitektonski
 * tlocrt iz stare baze slika je tuđi dom sa imenom investitora, pečatima
 * i potpisima, pa ne sme na javni sajt.
 *
 * Crtež je namerno veći od trake: zidovi izlaze preko ivica, pa se čita
 * kao isečak nacrta, ne kao uokvirena slika. Oznaka severa je brend znak
 * (kvadrat, krug, trougao), isti kao ikonice ispod heroja.
 *
 * Linije su `currentColor`: boju i masku (gde se crtež gubi iza teksta)
 * određuje `.vebinar-tlocrt` u `fs-c.css`.
 */
const TlocrtPozadina = () => (
  <svg
    className="vebinar-tlocrt"
    viewBox="0 0 1440 480"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.4}
    aria-hidden="true"
  >
    {/* spoljni zid, gore: tri prozora */}
    <path d="M-40 34H150M260 34H700M820 34H1260M1360 34H1480" />
    <path d="M-40 42H150M260 42H700M820 42H1260M1360 42H1480" />
    <path d="M150 34V42M260 34V42M700 34V42M820 34V42M1260 34V42M1360 34V42" />
    <path d="M150 38H260M700 38H820M1260 38H1360" strokeWidth={1} />

    {/* spoljni zid, dole: ulaz i erker */}
    <path d="M-40 438H470M540 438H1030M1210 438H1480" />
    <path d="M-40 446H470M540 446H1030M1210 446H1480" />
    <path d="M470 438V446M540 438V446" />
    <path d="M1030 446L1062 476H1178L1210 446M1030 438L1066 470H1174L1210 438" />
    <path d="M470 442L470 372M540 442A70 70 0 0 0 470 372" strokeWidth={1} />

    {/* unutrašnji zidovi */}
    <path d="M320 42V250M328 42V250M320 320V438M328 320V438" />
    <path d="M660 42V150M668 42V150M660 220V250M668 220V258" />
    <path d="M668 250H760M668 258H760M830 250H1000M830 258H1000" />
    <path d="M1000 42V330M1008 42V330M1000 400V438M1008 400V438" />

    {/* vrata */}
    <path d="M324 250H394M394 250A70 70 0 0 1 324 320" strokeWidth={1} />
    <path d="M664 150H734M734 150A70 70 0 0 1 664 220" strokeWidth={1} />
    <path d="M1004 330H934M934 330A70 70 0 0 0 1004 400" strokeWidth={1} />
    <path d="M760 254V324M760 324A70 70 0 0 0 830 254" strokeWidth={1} />

    {/* stepenište */}
    <path d="M40 70H170V230H40Z" />
    <path d="M40 90H170M40 110H170M40 130H170M40 150H170M40 170H170M40 190H170M40 210H170" strokeWidth={1} />
    <path d="M105 222V82M97 94L105 82L113 94" strokeWidth={1} />

    {/* oznaka severa: brend znak */}
    <path d="M1292 302H1348V358H1292Z" strokeWidth={1} />
    <circle cx="1320" cy="330" r="28" strokeWidth={1} />
    <path d="M1320 302L1344.2 344H1295.8Z" strokeWidth={1} />
  </svg>
);

export default TlocrtPozadina;
