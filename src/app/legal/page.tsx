"use client";

import PageTitleAnimated from "@/components/ui/PageTitleAnimated";
import { BiGlobe } from "react-icons/bi";
import { useState } from "react";

export default function Legal() {
  const [translated, setTranslated] = useState(false);

  return (
    <>
      <div className="flex items-start justify-between">
        <PageTitleAnimated>
          {translated ? "Rechtliches" : "Legal notes"} 👍
        </PageTitleAnimated>
        <button
          onClick={() => setTranslated(!translated)}
          className="flex items-center gap-1 rounded-lg p-2 hover:bg-actionlight"
        >
          <BiGlobe />
          {translated ? "DE -> EN" : "EN -> DE"}
        </button>{" "}
      </div>

      <article>
        <h2 className="my-6">
          {translated ? "Datenschutzerklärung" : "Privacy Policy"}
        </h2>
        <section className="mb-8 flex flex-col gap-4">
          <p>
            {translated ? (
              <span>
                Personenbezogene Daten (nachfolgend zumeist nur „Daten“ genannt)
                werden von uns nur im Rahmen der Erforderlichkeit sowie zum
                Zwecke der Bereitstellung eines funktionsfähigen und
                nutzerfreundlichen Internetauftritts, inklusive seiner Inhalte
                und der dort angebotenen Leistungen, verarbeitet. Gemäß Art. 4
                Ziffer 1. der Verordnung (EU) 2016/679, also der
                Datenschutz-Grundverordnung (nachfolgend nur &quot;DSGVO&quot;
                genannt), gilt als „Verarbeitung“ jeder mit oder ohne Hilfe
                automatisierter Verfahren ausgeführter Vorgang oder jede solche
                Vorgangsreihe im Zusammenhang mit personenbezogenen Daten, wie
                das Erheben, das Erfassen, die Organisation, das Ordnen, die
                Speicherung, die Anpassung oder Veränderung, das Auslesen, das
                Abfragen, die Verwendung, die Offenlegung durch Übermittlung,
                Verbreitung oder eine andere Form der Bereitstellung, den
                Abgleich oder die Verknüpfung, die Einschränkung, das Löschen
                oder die Vernichtung.
              </span>
            ) : (
              <span>
                Personal data (usually referred to just as &quot;data&quot;
                below) will only be processed by us to the extent necessary and
                for the purpose of providing a functional and user-friendly
                website, including its contents, and the services offered there.
                Per Art. 4 No. 1 of Regulation (EU) 2016/679, i.e. the General
                Data Protection Regulation (hereinafter referred to as the
                „GDPR“), „processing“ refers to any operation or set of
                operations such as collection, recording, organization,
                structuring, storage, adaptation, alteration, retrieval,
                consultation, use, disclosure by transmission, dissemination, or
                otherwise making available, alignment, or combination,
                restriction, erasure, or destruction performed on personal data,
                whether by automated means or not.
              </span>
            )}
          </p>

          <p>
            {translated
              ? "Mit der nachfolgenden Datenschutzerklärung informieren wir Sie insbesondere über Art, Umfang, Zweck, Dauer und Rechtsgrundlage der Verarbeitung personenbezogener Daten, soweit wir entweder allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung entscheiden. Zudem informieren wir Sie nachfolgend über die von uns zu Optimierungszwecken sowie zur Steigerung der Nutzungsqualität eingesetzten Fremdkomponenten, soweit hierdurch Dritte Daten in wiederum eigener Verantwortung verarbeiten."
              : "The following privacy policy is intended to inform you in particular about the type, scope, purpose, duration, and legal basis for the processing of such data either under our own control or in conjunction with others. We also inform you below about the third-party components we use to optimize our website and improve the user experience which may result in said third parties also processing data they collect and control."}
          </p>
          <p>
            {translated
              ? "Unsere Datenschutzerklärung ist wie folgt gegliedert:"
              : "Our privacy policy is structured as follows:"}{" "}
          </p>
          <ol>
            <li className="ml-8">
              {translated
                ? "I. Informationen über uns als Verantwortliche"
                : "I. Information about us as controllers of your data"}
            </li>
            <li className="ml-8">
              {translated
                ? "II. Rechte der Nutzer und Betroffenen"
                : "II. The rights of users and data subjects"}
            </li>
            <li className="ml-8">
              {translated
                ? "III. Informationen zur Datenverarbeitung"
                : "III. Information about the data processing"}
            </li>
          </ol>
        </section>
        <section className="mb-8 flex flex-col gap-4">
          <h3>
            {" "}
            {translated
              ? "I. Informationen über uns als Verantwortliche"
              : "I. Information about us as controllers of your data"}
          </h3>
          <p>
            {translated ? (
              <span>
                Verantwortlicher Anbieter dieses Internetauftritts im
                datenschutzrechtlichen Sinne ist
              </span>
            ) : (
              <span>
                The party responsible for this website (the „controller“) for
                purposes of data protection law is:
              </span>
            )}
          </p>
          <ul className="mt-2">
            <li>Steffen Ermisch</li>
            <li>Pressebüro JP4</li>
            <li>Richard-Wagner-Str. 10-12 </li>
            <li>50674 Köln, Germany</li>
            <li>Telefon: +4922192391316</li>
            <li>
              <span className="before:content-['ch'] after:content-['ail.com']">
                &#101;ckflix2023&#64;gm
              </span>
            </li>
          </ul>
        </section>
        <section className="mb-8 flex flex-col gap-4">
          <h3>
            {" "}
            {translated
              ? "II. Rechte der Nutzer und Betroffenen"
              : "II. The rights of users and data subjects"}
          </h3>
          <p>
            {translated
              ? " Mit Blick auf die nachfolgend noch näher beschriebene Datenverarbeitung haben die Nutzer und Betroffenen das Recht"
              : "With regard to the data processing to be described in more detail below, users and data subjects have the right"}
          </p>
          <ul className="mt-2">
            <li className="ml-8">
              {translated
                ? "- auf Bestätigung, ob sie betreffende Daten verarbeitet werden,"
                : "- to confirmation of whether data concerning them is being processed,"}
            </li>
            <li className="ml-8">
              {translated ? (
                <span>
                  - auf Auskunft über die verarbeiteten Daten, auf weitere
                  Informationen über die Datenverarbeitung sowie auf Kopien der
                  Daten (vgl. auch Art. 15 DSGVO);
                </span>
              ) : (
                <span>
                  - information about the data being processed, further
                  information about the nature of the data processing, and
                  copies of the data (cf. also Art. 15 GDPR);
                </span>
              )}
            </li>
            <li className="ml-8">
              {translated
                ? "- auf Berichtigung oder Vervollständigung unrichtiger bzw. unvollständiger Daten (vgl. auch Art. 16 DSGVO);"
                : "- to correct or complete incorrect or incomplete data (cf. also Art. 16 GDPR);"}
            </li>
            <li className="ml-8">
              {translated ? (
                <span>
                  - auf unverzügliche Löschung der sie betreffenden Daten (vgl.
                  auch Art. 17 DSGVO), oder, alternativ, soweit eine weitere
                  Verarbeitung gemäß Art. 17 Abs. 3 DSGVO erforderlich ist, auf
                  Einschränkung der Verarbeitung nach Maßgabe von Art. 18 DSGVO;
                </span>
              ) : (
                <span>
                  - to the immediate deletion of data concerning them (cf. also
                  Art. 17 DSGVO), or, alternatively, if further processing is
                  necessary as stipulated in Art. 17 Para. 3 GDPR, to restrict
                  said processing per Art. 18 GDPR;
                </span>
              )}
            </li>
            <li className="ml-8">
              {translated ? (
                <span>
                  - auf Erhalt der sie betreffenden und von ihnen
                  bereitgestellten Daten und auf Übermittlung dieser Daten an
                  andere Anbieter/Verantwortliche (vgl. auch Art. 20 DSGVO);
                </span>
              ) : (
                <span>
                  - to receive copies of the data concerning them and/or
                  provided by them and to have the same transmitted to other
                  providers/controllers (cf. also Art. 20 GDPR);
                </span>
              )}
            </li>
            <li className="ml-8">
              {translated ? (
                <span>
                  {" "}
                  - auf Beschwerde gegenüber der Aufsichtsbehörde, sofern sie
                  der Ansicht sind, dass die sie betreffenden Daten durch den
                  Anbieter unter Verstoß gegen datenschutzrechtliche
                  Bestimmungen verarbeitet werden (vgl. auch Art. 77 DSGVO).
                </span>
              ) : (
                <span>
                  - to file complaints with the supervisory authority if they
                  believe that data concerning them is being processed by the
                  controller in breach of data protection provisions (see also
                  Art. 77 GDPR).
                </span>
              )}
            </li>
          </ul>
          {translated ? (
            <p>
              Darüber hinaus ist der Anbieter dazu verpflichtet, alle Empfänger,
              denen gegenüber Daten durch den Anbieter offengelegt worden sind,
              über jedwede Berichtigung oder Löschung von Daten oder die
              Einschränkung der Verarbeitung, die aufgrund der Artikel 16, 17
              Abs. 1, 18 DSGVO erfolgt, zu unterrichten. Diese Verpflichtung
              besteht jedoch nicht, soweit diese Mitteilung unmöglich oder mit
              einem unverhältnismäßigen Aufwand verbunden ist. Unbeschadet
              dessen hat der Nutzer ein Recht auf Auskunft über diese Empfänger.
            </p>
          ) : (
            <p>
              In addition, the controller is obliged to inform all recipients to
              whom it discloses data of any such corrections, deletions, or
              restrictions placed on processing the same per Art. 16, 17 Para.
              1, 18 GDPR. However, this obligation does not apply if such
              notification is impossible or involves a disproportionate effort.
              Nevertheless, users have a right to information about these
              recipients.
            </p>
          )}

          {translated ? (
            <p>
              Ebenfalls haben die Nutzer und Betroffenen nach Art. 21 DSGVO das
              Recht auf Widerspruch gegen die künftige Verarbeitung der sie
              betreffenden Daten, sofern die Daten durch den Anbieter nach
              Maßgabe von Art. 6 Abs. 1 lit. f) DSGVO verarbeitet werden.
              Insbesondere ist ein Widerspruch gegen die Datenverarbeitung zum
              Zwecke der Direktwerbung statthaft.
            </p>
          ) : (
            <p>
              Likewise, under Art. 21 GDPR, users and data subjects have the
              right to object to the controller’s future processing of their
              data pursuant to Art. 6 Para. 1 lit. f) GDPR. In particular, an
              objection to data processing for the purpose of direct advertising
              is permissible.
            </p>
          )}
        </section>
        <section className="mb-8 flex flex-col gap-4">
          <h3>
            {translated
              ? "III. Informationen zur Datenverarbeitung"
              : "III. Information about the data processing"}
          </h3>
          {translated ? (
            <p>
              Ihre bei Nutzung unseres Internetauftritts verarbeiteten Daten
              werden gelöscht oder gesperrt, sobald der Zweck der Speicherung
              entfällt, der Löschung der Daten keine gesetzlichen
              Aufbewahrungspflichten entgegenstehen und nachfolgend keine
              anderslautenden Angaben zu einzelnen Verarbeitungsverfahren
              gemacht werden.
            </p>
          ) : (
            <p>
              Your data processed when using our website will be deleted or
              blocked as soon as the purpose for its storage ceases to apply,
              provided the deletion of the same is not in breach of any
              statutory storage obligations or unless otherwise stipulated
              below.
            </p>
          )}

          <h4 className="my-2 underline" id="cookies">
            Cookies
          </h4>
          <h5 className="font-bold">
            a){" "}
            {translated ? "Sitzungs-Cookies/Session-Cookie" : "Session cookies"}
            s
          </h5>
          {translated ? (
            <p>
              Wir verwenden mit unserem Internetauftritt sog. Cookies. Cookies
              sind kleine Textdateien oder andere Speichertechnologien, die
              durch den von Ihnen eingesetzten Internet-Browser auf Ihrem
              Endgerät ablegt und gespeichert werden. Durch diese Cookies werden
              im individuellen Umfang bestimmte Informationen von Ihnen, wie
              beispielsweise Ihre Browser- oder Standortdaten oder Ihre
              IP-Adresse, verarbeitet.
            </p>
          ) : (
            <p>
              We use cookies on our website. Cookies are small text files or
              other storage technologies stored on your computer by your
              browser. These cookies process certain specific information about
              you, such as your browser, location data, or IP address.
            </p>
          )}
          {translated ? (
            <p>
              Durch diese Verarbeitung wird unser Internetauftritt
              benutzerfreundlicher, effektiver und sicherer, da die Verarbeitung
              bspw. die Wiedergabe unseres Internetauftritts in
              unterschiedlichen Sprachen oder das Angebot einer
              Warenkorbfunktion ermöglicht.
            </p>
          ) : (
            <p>
              This processing makes our website more user-friendly, efficient,
              and secure, allowing us, for example, to display our website in
              different languages or to offer a shopping cart function.
            </p>
          )}
          {translated ? (
            <p>
              Rechtsgrundlage dieser Verarbeitung ist Art. 6 Abs. 1 lit b.)
              DSGVO, sofern diese Cookies Daten zur Vertragsanbahnung oder
              Vertragsabwicklung verarbeitet werden.
            </p>
          ) : (
            <p>
              The legal basis for such processing is Art. 6 Para. 1 lit. b)
              GDPR, insofar as these cookies are used to collect data to
              initiate or process contractual relationships.
            </p>
          )}
          {translated ? (
            <p>
              Falls die Verarbeitung nicht der Vertragsanbahnung oder
              Vertragsabwicklung dient, liegt unser berechtigtes Interesse in
              der Verbesserung der Funktionalität unseres Internetauftritts.
              Rechtsgrundlage ist in dann Art. 6 Abs. 1 lit. f) DSGVO.
            </p>
          ) : (
            <p>
              If the processing does not serve to initiate or process a
              contract, our legitimate interest lies in improving the
              functionality of our website. The legal basis is then Art. 6 Para.
              1 lit. f) GDPR.
            </p>
          )}
          {translated ? (
            <p>
              Ein Cookie wird beispielsweise gesetzt, wenn Sie sich in dieser
              Applikation einloggen, damit sie sich nicht bei jedem Seitenaufruf
              neu anmelden müssen.
            </p>
          ) : (
            <p>
              A cookie is set for example when you sign into the Hans app to
              store your session data.
            </p>
          )}
          <h5 className="font-bold">
            b) {translated ? "Drittanbieter-Cookies" : "Third-party cookies"}
          </h5>
          {translated ? (
            <p>
              Gegebenenfalls werden mit unserem Internetauftritt auch Cookies
              von Partnerunternehmen, mit denen wir zum Zwecke der Werbung, der
              Analyse oder der Funktionalitäten unseres Internetauftritts
              zusammenarbeiten, verwendet.
            </p>
          ) : (
            <p>
              If necessary, our website may also use cookies from companies with
              whom we cooperate for the purpose of advertising, analyzing, or
              improving the features of our website.
            </p>
          )}
          <p>
            {translated
              ? "Konkret können folgende Cookies gesetzt werden:"
              : "More specifically these Cookies may be set:"}
          </p>
          <ul>
            {translated ? (
              <li className="ml-8">
                - Ybug: Wenn Sie den &quot;Feedback&quot;-Button nutzen werden
                temporär Cookies gesetzt, um das Feedback ordnungsgemäß
                übermitteln zu können
              </li>
            ) : (
              <li className="ml-8">
                - Ybug: Whenever you use the button &quot;Feedback&quot; cookies
                will be set temporarily to submit your feedback.
              </li>
            )}
          </ul>
          <h5 className="font-bold">
            c) {translated ? "Beseitigungsmöglichkeit" : "Disabling cookies"}
          </h5>
          {translated ? (
            <p>
              Sie können die Installation der Cookies durch eine Einstellung
              Ihres Internet-Browsers verhindern oder einschränken. Ebenfalls
              können Sie bereits gespeicherte Cookies jederzeit löschen. Die
              hierfür erforderlichen Schritte und Maßnahmen hängen jedoch von
              Ihrem konkret genutzten Internet-Browser ab. Bei Fragen benutzen
              Sie daher bitte die Hilfefunktion oder Dokumentation Ihres
              Internet-Browsers oder wenden sich an dessen Hersteller bzw.
              Support.
            </p>
          ) : (
            <p>
              You can refuse the use of cookies by changing the settings on your
              browser. Likewise, you can use the browser to delete cookies that
              have already been stored. However, the steps and measures required
              vary, depending on the browser you use. If you have any questions,
              please use the help function or consult the documentation for your
              browser or contact its maker for support.
            </p>
          )}

          {translated ? (
            <p>
              Wir haben außerdem auf der Startseite einen Cookie-Button
              integriert, über den Sie gespeicherte Cookies löschen können.
            </p>
          ) : (
            <p>
              You will also find a cookie button on the start page of this
              website that helps you to delete cookies.
            </p>
          )}
          {translated ? (
            <p>
              Sollten Sie die Installation der Cookies verhindern oder
              einschränken, kann dies allerdings dazu führen, dass nicht
              sämtliche Funktionen unseres Internetauftritts vollumfänglich
              nutzbar sind.
            </p>
          ) : (
            <p>
              If you prevent or restrict the installation of cookies, not all of
              the functions on our site may be fully usable.
            </p>
          )}
          <h4 className="underline">
            {translated ? "Kontaktanfragen / Kontaktmöglichkeit" : "Contact"}
          </h4>
          {translated ? (
            <p>
              Sofern Sie per Kontaktformular, Feedbackformular oder E-Mail mit
              uns in Kontakt treten, werden die dabei von Ihnen angegebenen
              Daten zur Bearbeitung Ihrer Anfrage genutzt. Die Angabe der Daten
              ist zur Bearbeitung und Beantwortung Ihre Anfrage erforderlich –
              ohne deren Bereitstellung können wir Ihre Anfrage nicht oder
              allenfalls eingeschränkt beantworten.
            </p>
          ) : (
            <p>
              If you contact us via email, feedback from or the contact form,
              the data you provide will be used for the purpose of processing
              your request. We must have this data in order to process and
              answer your inquiry; otherwise we will not be able to answer it in
              full or at all.
            </p>
          )}
          <p>
            {translated
              ? "Rechtsgrundlage für diese Verarbeitung ist Art. 6 Abs. 1 lit. b) DSGVO."
              : "The legal basis for this data processing is Art. 6 Para. 1 lit. b) GDPR."}
          </p>
          {translated ? (
            <p>
              Ihre Daten werden gelöscht, sofern Ihre Anfrage abschließend
              beantwortet worden ist und der Löschung keine gesetzlichen
              Aufbewahrungspflichten entgegenstehen, wie bspw. bei einer sich
              etwaig anschließenden Vertragsabwicklung.
            </p>
          ) : (
            <p>
              Your data will be deleted once we have fully answered your inquiry
              and there is no further legal obligation to store your data, such
              as if an order or contract resulted therefrom.
            </p>
          )}
          <h4 className="underline">
            {translated ? "Serverdaten" : "Server data"}
          </h4>

          {translated ? (
            <p>
              Unsere Internetpräsenz wird auf Servern in Deutschland gehostet,
              Anbieter der Serverleistung ist:
            </p>
          ) : (
            <p>
              This website is hosted on servers located in Germany. Provider:{" "}
            </p>
          )}
          <ul>
            <li>Hetzner Online GmbH</li>
            <li>Industriestr. 25</li>
            <li>91710 Gunzenhausen, Germany</li>
          </ul>
          {translated ? (
            <p>
              Aus technischen Gründen, insbesondere zur Gewährleistung eines
              sicheren und stabilen Internetauftritts, werden Daten durch Ihren
              Internet-Browser an uns bzw. an unseren Webspace-Provider
              übermittelt. Mit diesen sog. Server-Logfiles werden u.a. Typ und
              Version Ihres Internetbrowsers, das Betriebssystem, die Website,
              von der aus Sie auf unseren Internetauftritt gewechselt haben
              (Referrer URL), die Website(s) unseres Internetauftritts, die Sie
              besuchen, Datum und Uhrzeit des jeweiligen Zugriffs sowie die
              IP-Adresse des Internetanschlusses, von dem aus die Nutzung
              unseres Internetauftritts erfolgt, erhoben.
            </p>
          ) : (
            <p>
              For technical reasons, the following data sent by your internet
              browser to us or to our server provider will be collected,
              especially to ensure a secure and stable website: These server log
              files record the type and version of your browser, operating
              system, the website from which you came (referrer URL), the
              webpages on our site visited, the date and time of your visit, as
              well as the IP address from which you visited our site.
            </p>
          )}
          {translated ? (
            <p>
              Diese so erhobenen Daten werden vorrübergehend gespeichert, dies
              jedoch nicht gemeinsam mit anderen Daten von Ihnen. Diese
              Speicherung erfolgt auf der Rechtsgrundlage von Art. 6 Abs. 1 lit.
              f) DSGVO. Unser berechtigtes Interesse liegt in der Verbesserung,
              Stabilität, Funktionalität und Sicherheit unseres
              Internetauftritts.
            </p>
          ) : (
            <p>
              The data thus collected will be temporarily stored, but not in
              association with any other of your data. The basis for this
              storage is Art. 6 Para. 1 lit. f) GDPR. Our legitimate interest
              lies in the improvement, stability, functionality, and security of
              our website.
            </p>
          )}
          {translated ? (
            <p>
              Die Daten werden spätestens nach sieben Tage wieder gelöscht,
              soweit keine weitere Aufbewahrung zu Beweiszwecken erforderlich
              ist. Andernfalls sind die Daten bis zur endgültigen Klärung eines
              Vorfalls ganz oder teilweise von der Löschung ausgenommen.
            </p>
          ) : (
            <p>
              The data will be deleted within no more than seven days, unless
              continued storage is required for evidentiary purposes. In which
              case, all or part of the data will be excluded from deletion until
              the investigation of the relevant incident is finally resolved.
            </p>
          )}
          <h4 className="underline">{translated ? "App-Daten" : "App data"}</h4>
          {translated ? (
            <p>
              Wenn Sie sich bei der App &quot;Hans&quot; anmelden und nutzen,
              werden die von Ihnen übermittelten Daten aus technischen Gründen
              verarbeitet und gespeichert.
            </p>
          ) : (
            <p>
              When you sign up for the app &quot;Hans&quot; and use this app,
              the data you provide will be processed and stored.{" "}
            </p>
          )}

          {translated ? (
            <p>
              Sinn und Zweck dieser App ist es, von Ihnen hochgeladene
              Audio-Dateien zu transkribieren. Dazu werden sowohl die
              Audio-Datei als auch das Ergebnis der Transkription sowie
              eventuelle Bearbeitungen in unserer Datenbank gespeichert. Wir
              speichern zudem Daten, die mit Ihrem Nutzerkonto zusammenhängen.
              Dazu gehören beispielsweise Ihre E-Mail-Adresse und Ihr Passwort.
              Unsere Datenbank läuft auf Severn in Deutschland, der Betreiber
              der Server ist:
            </p>
          ) : (
            <p>
              The purpose of the app is to create transcripts from your uploaded
              audio files. Both the respective audio file and the result the
              result of the transcription and any edits are saved in our
              database. Data related to your user account is also stored, such
              as your e-mail address your password and similar data. Our
              database is hosted on servers in Germany, the provider of the
              server is:
            </p>
          )}

          <ul>
            <li>Hetzner Online GmbH</li>
            <li>Industriestr. 25</li>
            <li>91710 Gunzenhausen</li>
          </ul>
          {translated ? (
            <p>
              Sie können einzelne Transkriptions-Projekte oder Ihr gesamtes
              Nutzerkonto inklusive der zugehörigen Daten selbständig in der
              Anwendung löschen.
            </p>
          ) : (
            <p>
              Within the app you may delete single transcription projects or
              your whole user account with all related data.
            </p>
          )}

          {translated ? (
            <p className="bg-warning p-2 text-white">
              Bitte beachten Sie: Die Anwendung &quot;Hans&quot; ist derzeit ein
              nicht-kommerzielles Demo-Projekt. Der Betrieb kann jeder Zeit
              geändert oder eingestellt werden. Bitte nutzen Sie diese Anwendung
              nur zu Testzwecken und insbesondere nicht mit sensiblen bzw.
              personenbezogenen Daten.
            </p>
          ) : (
            <p className="bg-warning p-2 text-white">
              Please note: The &quot;Hans&quot; application is currently a
              non-commercial demo project. Operation can be changed or
              discontinued at any time. Please use this application only for
              test purposes and especially not with sensitive or personal data.
            </p>
          )}
          <h4 className="underline">
            {translated
              ? "Datenverarbeitung durch OpenAI"
              : "Data processing by OpenAI"}
          </h4>
          {translated ? (
            <p>
              Für die eigentliche Transkription wird eine Schnittstelle
              (&quot;API&quot;) zum US-Unternehmen OpenAI (OpenAI Ireland
              Limited mit eingetragenem Sitz in „The Liffey Trust Centre“,
              117-126 Sheriff Street Upper, Dublin 1, D01 YC43, Irland) genutzt.
              Auf Servern dieses Anbieters, die in den USA liegen können, wird
              die von Ihnen hochgeladene Audio-Datei verarbeitet. Dies ist
              notwendig, um die angeforderte Leistung zu erbringen.
            </p>
          ) : (
            <p>
              An interface (&quot;API&quot;) to the US company OpenAI (OpenAI
              Ireland Limited with registered office at &quot;The Liffey Trust
              Centre&quot;, 117-126 Sheriff Street Upper, Dublin 1, D01 YC43,
              Ireland) is used for the actual transcription. The audio file
              uploaded by you is processed on the servers of this provider,
              which may be located in the USA. This is necessary in order to
              provide the requested service.
            </p>
          )}
          {translated ? (
            <p>
              Die Nutzung erfolgt entweder über Ihren eigenen OpenAI-Account
              oder über den des Betreibers dieser Webseite. Unser Account ist so
              eingestellt, dass übermittelte Daten von OpenAI nicht zum Training
              der KI-Modelle verwendet werden.
            </p>
          ) : (
            <p>
              You can use it either via your own OpenAI account or via the
              account of the operator of this website. Our account is set up so
              that that data transmitted by OpenAI is not used to train the AI
              models.
            </p>
          )}

          <h4 className="underline">
            {translated ? "Analyse-Tool" : "Analytics"}
          </h4>
          {translated ? (
            <p>
              Auf diesen Seiten wird das Tool{" "}
              <a href={"https://umami.is/"}>Umami</a> genutzt.
            </p>
          ) : (
            <p>
              This websites uses the tool{" "}
              <a href={"https://umami.is/"}>Umami</a>.
            </p>
          )}
          {translated ? (
            <p>
              Mit der Hlfe von Umami sind wir in der Lage, Daten über die
              Nutzung unserer Webseite zu erfassen und zu analysieren. Hierdurch
              k&ouml;nnen wir u.&nbsp;a. herausfinden, wann welche Seitenaufrufe
              get&auml;tigt wurden und aus welcher Region sie kommen.
              Au&szlig;erdem erfassen wir verschiedene Logdateien (z.&nbsp;B.
              Referrer, verwendete Browser und Betriebssysteme) und k&ouml;nnen
              messen, ob unsere Websitebesucher bestimmte Aktionen
              durchf&uuml;hren (z.&nbsp;B. Klicks, K&auml;ufe u. &Auml;.).
            </p>
          ) : (
            <p>
              With the help of Umami, we are able to collect and analyze data
              about the use of our website. This allows us to find out, among
              other things, when which pages were accessed and from which
              region. We also record various log files (e.g. referrer, browser
              and operating system used) and can measure whether our website
              visitors perform certain actions (e.g. clicks, purchases, etc.).
            </p>
          )}
          {translated ? (
            <p>
              Die Nutzung dieses Analyse-Tools erfolgt auf Grundlage von Art. 6
              Abs. 1 lit. f DSGVO. Der Websitebetreiber hat ein berechtigtes
              Interesse an der Analyse des Nutzerverhaltens, um sowohl sein
              Webangebot als auch seine Werbung zu optimieren.{" "}
            </p>
          ) : (
            <p>
              This analysis tool is used on the basis of Art. 6 para. 1 lit. f
              GDPR. The website operator has a legitimate interest in analyzing
              user behavior in order to optimize both its website and its
              advertising.
            </p>
          )}
          {translated ? (
            <p>
              Das Analysetool erlaubt es uns nicht, einzelne Nutzer eindeutig
              zuzuordnen. Insbesondere werden keine IP-Adressen der Nutzer
              aufgezeichnet.
            </p>
          ) : (
            <p>
              The analysis tool does not allow us to clearly assign individual
              users. In particular, no IP addresses of users are recorded.
            </p>
          )}
        </section>
        <section className="mb-8">
          {translated ? (
            <p className="italic">
              Diese Datenschutz-Erklärung wurde erstellt mit Hilfe der{" "}
              <a
                href="https://www.generator-datenschutzerklärung.de"
                target="_blank"
                rel="noopener"
                className="underline decoration-action"
              >
                Muster-Datenschutzerklärung
              </a>{" "}
              der{" "}
              <a
                href="https://www.bewertung-löschen24.de"
                rel="nofollow noopener"
                target="_blank"
                className="underline decoration-action"
              >
                Anwaltskanzlei Weiß &amp; Partner
              </a>
            </p>
          ) : (
            <p className="italic">
              This privacy policy was created with the help of{" "}
              <a
                href="https://www.generator-datenschutzerklärung.de"
                target="_blank"
                rel="noopener"
                className="underline decoration-action"
              >
                Model Data Protection Statement
              </a>{" "}
              of{" "}
              <a
                href="https://www.bewertung-löschen24.de"
                rel="nofollow noopener"
                target="_blank"
                className="underline decoration-action"
              >
                Anwaltskanzlei Weiß &amp; Partner
              </a>
            </p>
          )}
        </section>
      </article>
    </>
  );
}
