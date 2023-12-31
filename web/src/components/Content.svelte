<script lang="ts">
    import Section from "./Section.svelte";
    import Divider from "./Divider.svelte";
    import ImageWithDesc from "./ImageWithDesc.svelte";
    import ResourceReferenceElement from "./ResourceReferenceElement.svelte";
    import ResourceRef from "$lib/resourceref";
    import Link from "./Link.svelte";
    import NoiseExample from "./NoiseExample.svelte";
    import Nbsp from "./Nbsp.svelte";
    import {
        FRAGMENT_SHADER_FOR_CIRCLE,
        FRAGMENT_SHADER_RESULTING_IN_WATER_ETC,
        FRAGMENT_SHADER_USING_PERLIN_COMBINED,
        FRAGMENT_SHADER_USING_PERLIN_COMBINED_MAX,
        FRAGMENT_SHADER_USING_PERLIN_COMPLEX_ISLANDS,
        FRAGMENT_SHADER_USING_PERLIN_NOISE,
        FRAGMENT_SHADER_USING_SIMPLEX_NOISE,
        FRAGMENT_SHADER_USING_VALUE_NOISE,
    } from "$lib/fragmentshaders";
    import Viewer3d from "./viewer3d.svelte";
    import Modal from "./Modal.svelte";
    import Mark from "./Mark.svelte";
    import { onMount } from "svelte";
    import {
        BUILD_CAVES,
        CALCULATE_TERRAIN_HEIGHT,
        ITERATE_2D_COORDS,
        PERLIN_INIT,
        SET_TOPLEVEL_BLOCK,
    } from "$lib/javacode";
    import CodeStep from "./CodeStep.svelte";
    import createShaderFractalNoise, { Shader3D } from "$lib/shader3d";
    import createShaderWorldSimulation, {
        rotationsValues,
    } from "$lib/worldSimulationShader3d";
    //@ts-ignore
    // import Prism from "prismjs";
    // import loadLanguages from "prismjs/components/"
    // if(globalThis["window"] !== undefined){
    //     console.log(loadLanguages)
    //     loadLanguages(['haml']);
    // }
    let image_allCombined = ResourceRef.getResourceRef("Endergebnis");

    let perlinnoiseExplained = ResourceRef.getResourceRef("Erklärung Perlin Noise");

    let valueNoise = ResourceRef.getResourceRef("Value Noise");
    let perlinNoise = ResourceRef.getResourceRef("Perlin Noise");
    let simplexNoise = ResourceRef.getResourceRef("Simplex Noise");
    let noiseCircleExample = ResourceRef.getResourceRef(
        "Kreis mit Oszillierend radius, ungeglättet mit Perlin noise mehreren",
    );
    let perlinNoise3D = ResourceRef.getResourceRef("2D Perin Noise auf 3D Ebene");

    let overlappingPerlinNoise = ResourceRef.getResourceRef(
        "Summe mehrerer Perlin Noise (Fractal Noise)",
    );
    let overlappingPerlinNoiseMax = ResourceRef.getResourceRef(
        "Maximalwerte mehrerer Perlin Noise",
    );

    let minecraftflatNoise = ResourceRef.getResourceRef("Minecraft Flat Noise");

    let minecrafthillyNoise = ResourceRef.getResourceRef("Minecraft Hilly Noise");

    let minecrafthillyAndFlatNoise = ResourceRef.getResourceRef(
        "Minecraft Hilly and Flat Noise",
    );

    let simulationTerrainGeneration = ResourceRef.getResourceRef(
        "Simulation Landschaftsgenerierung",
    );

    let minecraftCaves = ResourceRef.getResourceRef("Minecraft Höhlen");

    let minecraftAllTogether = ResourceRef.getResourceRef("Das Endergebnis");

    let curaWithItem = ResourceRef.getResourceRef("Cura Slicer Vorschau");

    let modal = {
        show: false,
        htmlcode: "",
    };
    function openModal(glsl: string) {
        //@ts-ignore
        const html = Prism.highlight(glsl, Prism.languages.glsl, "glsl");

        modal.show = true;
        modal.htmlcode = html;
        modal = modal;
    }
    let rotX = 45;
    let rotY = 20;
    let rotZ = 80;
    let scale = 60;

    $: {
        rotationsValues.x = rotX;
        rotationsValues.y = rotY;
        rotationsValues.z = rotZ - 100;
        rotationsValues.scale = scale / 100;
    }

    onMount(() => {
        //@ts-ignore
        Prism.highlightAll();
    });
</script>

<Modal bind:showModal={modal.show}>
    <pre><code class="line-numbers">{@html modal.htmlcode}</code></pre>
</Modal>

<Section title="Motivation">
    So wie die meisten habe ich früher viel Minecraft gespielt und war von der endlosen
    Größe der spielbaren Welt fasziniert. Damals als einfacher Benutzer habe ich das ganze
    System nicht weiter hinterfragt, mit meinem stetig zunehmenden Interesse zur
    Funktionsweise von Software / IT wollte ich jedoch verstehen, wie und warum die Welt
    so endlos und vielfältig ist. Ich bin auf verschiedene Begriffe wie Prozedural,
    Generisch und Noise gestoßen, bin in das Thema jedoch nie weiter eingestiegen.
    <br /><br />
    In der Vorlesung "Computergrafik" meines Informatikstudiums wurde als benotete Aufgabe
    neben dem Schreiben eines Raytracers und WebGL Shaders auch angeboten, generische Formen
    zu erzeugen / konstruieren. Dabei dachte ich sofort wieder an die generische Welt von Minecraft
    und machte es mir zur Aufgabe, im Rahmen dieser Abgabe eine kleine, 100x100 Blöcke große,
    generisch erzeugte Welt zu konstruieren.
</Section>

<Section title="Der Plan">
    <Divider>
        <div slot="left">
            Das Ziel ist es, durch die Überlagerung von Noise-Funktionen einen Algorithmus
            zu entwickeln, der eine organisch wirkende Welt in Minecraft generiert. Diese
            Welt soll relativ gerade Graslandschaften haben und immer wieder von Hügeln,
            Seen und Stränden geprägt werden. Abschließend soll Minecrafttypisch das
            Konstrukt von dreidimensionalen Höhlen und Schluchten durchbohrt sein. <br />

            <br />
            Um den CAD-Aspekt der Aufgabe zu erfüllen, wird die generierte Weltsektion mit
            einem Tool in eine .obj-Datei exportiert. Dies ist in <ResourceReferenceElement
                reference={image_allCombined}
                showFullName={true}
            />
            zu sehen, wo sie in Blender gerendert und anschließend mit einem 3D-Drucker ausgedruckt
            wird. Das Spiel Minecraft ist also in diesem Kontext lediglich das Tool, welches
            die programmierten Noiseüberlagerungen darstellt (und Inspiration für dieses Projekt
            ist).<br /><br />

            Minecraft ist ein Paradebeispiel für das Konzept der <Link
                href="https://www.cs.cmu.edu/~112/notes/student-tp-guides/Terrain.pdf"
                >prozeduralen Landschaftsgenerierung</Link
            >, weshalb die Verwendung / Anlehnung an das Spiel naheliegend ist
        </div>
        <ImageWithDesc slot="right" imageRef={image_allCombined}>
            <img src="alltogether/rendered.png" alt="Endresult" />
        </ImageWithDesc>
    </Divider>
</Section>

<Section title="Hinweis">
    Die Funktionsweise (bzw. das Potential) von Noisefunktionen wird mithilfe von Shadern
    erklärt. Der verwendete Code für den Fragment Shader ist beim Klicken auf das
    Canvas-Element einsehbar. Hinweis: Der Code für die Noisefunktionen wird als gegeben
    betrachtet und ist im Quelltext als nicht selbst verfasst gekennzeichnet. Der
    restliche Code ist Eigenarbeit. Um den Rahmen dieser Arbeit nicht zu sprengen, wird
    der Code nicht direkt im Text, sondern in Form von Quelltextkommentaren erläutert.
</Section>

<Section title="Prozedurale Landschaftsgenerierung">
    Prozedurale Landschaftsgenerierung ist ein Verfahren in der Computergrafik und
    Spieleentwicklung zur automatischen Erstellung von Terrains und Landschaften in
    digitalen Umgebungen mittels Algorithmen. Sie nutzt mathematische Funktionen wie <Link
        href="https://www.cs.umd.edu/class/fall2019/cmsc425/handouts/lect14-perlin.pdf"
        >Perlin-Noise</Link
    >, um vielfältige und realistisch wirkende Szenerien zu schaffen, ohne dass jedes
    Detail von Hand modelliert werden müssen. Im Vergleich zu reinen
    Pseudo-Zufallsalgorithmen bietet Noise eine Interpolation zwischen Zufallswerten,
    wodurch daraus generierte Inhalte "weiche" Zustandsänderungen aufweisen.
    <br /><br />
    Beim einfachen Interpolieren zwischen Zufallswerten entsteht ein sogenanntes "Value Noise"
    (<ResourceReferenceElement reference={valueNoise} showFullName={false} />). Bei
    genauerem Betrachten lassen sich noch die harten Kanten zwischen den Zufallszahlen
    erkennen, wodurch der Value noise eine "blockartige Struktur" aufweist.<br />
    In manchen Anwendungsfällen (Wie in der Landschaftsgenerierung) sind solche offensichtlichen
    Artefakte unerwünscht.<br /><br /> In diesen Fällen bietet der sogenannte "Perlin
    Noise" (<ResourceReferenceElement reference={perlinNoise} showFullName={false} />) von <Link
        href="https://cs.nyu.edu/~perlin/">Ken Perlin</Link
    > abhilfe. Dieser ist durch eine deutlich organischere Struktur gekennzeichnet. Im Gegensatz
    zum Value Noise ist der Perlin Noise ein "Gradient Noise", also die Interpolation von Gradienten.
    Im Gradient Noise werden an jedem Punkt des Gitters (Also die Eckpunkte, zwischen denen
    die Interpolation stattfindet, siehe <ResourceReferenceElement
        reference={perlinnoiseExplained}
        showFullName={false}
    />) Gradientenvektoren generiert, die eine Richtung und eine Größe haben. <br />
    <br />

    <ImageWithDesc imageRef={perlinnoiseExplained}>
        <img src="imgs/noiseexplain.png" alt="gradient noise explained" />
        <span slot="desc">
            - <Link href="https://adrianb.io/2014/08/09/perlinnoise.html">[Quelle]</Link>
        </span>
    </ImageWithDesc>
    Basierend auf der Distanz zu den nächsten Gitterpunkten, werden diese Gradienten dann genutzt,
    um die Ausgabe zu interpolieren. Im Value Noise hingegen werden zufällige (skalare) Werte
    an den Gitterpunkten generiert und zwischen diesen interpoliert, ohne Berücksichtigung
    der Richtung. Da der Perlin Noise relativ rechenintensiv ist, wurde der 'Simplex Noise',
    auch auf Basis von Gradienten, entwickelt (<ResourceReferenceElement
        reference={simplexNoise}
        showFullName={false}
    />).

    <div class="flex flex-wrap justify-evenly mt-7">
        <ImageWithDesc imageRef={valueNoise}>
            <NoiseExample
                {openModal}
                fragmentShader={FRAGMENT_SHADER_USING_VALUE_NOISE}
            />
        </ImageWithDesc>
        <ImageWithDesc imageRef={perlinNoise}>
            <NoiseExample
                {openModal}
                fragmentShader={FRAGMENT_SHADER_USING_PERLIN_NOISE}
            />
        </ImageWithDesc>
        <ImageWithDesc imageRef={simplexNoise}>
            <NoiseExample
                {openModal}
                fragmentShader={FRAGMENT_SHADER_USING_SIMPLEX_NOISE}
            />
        </ImageWithDesc>
        <ImageWithDesc imageRef={noiseCircleExample}>
            <NoiseExample {openModal} fragmentShader={FRAGMENT_SHADER_FOR_CIRCLE} />
        </ImageWithDesc>
    </div>

    <br />
    <Divider>
        <svelte:fragment slot="left">
            Für die Landschaftsgenerierung wird mittels Noise häufig die Terrainhöhe
            bestimmt, die Farbwerte (Hier Graustufen) geben also an, wie hoch die
            Landschaft an den gegebenen Koordinaten von der Grundhöhe (Baseline) entfernt
            sind <ResourceReferenceElement reference={perlinNoise3D} />. <br />
            Trotz der weichen Übergänge und des insgesamt organisch und zufällig wirkenden
            Ergebnisses, wirkt das Graustufenmuster sehr gleichmäßig und "eindimensional".
            Dieser Effekt ist bei der Generierung von Landschaften unerwünscht. <br />
            Eine mögliche Lösung ist die Überlagerungen mehrerer (gleichartiger) Noise-Funktionen,
            wobei diese sich in einem Offset unterscheiden. Dieser Offset lässt durch die Pseudorandomisierung
            die Noisefunktion zueinander unterschiedlich aussehen.
        </svelte:fragment>

        <ImageWithDesc slot="right" imageRef={perlinNoise3D}>
            <NoiseExample
                {openModal}
                fragmentShader={""}
                createShaderFn={createShaderFractalNoise}
            />
            <!-- <img src="imgs/perlinnoise3d.png" alt="perlin noise 2d on 3d explained" />
            <span slot="desc">
                - <Link
                    href="https://www.researchgate.net/figure/Perlin-noise-pattern-represented-as-greyscale-image-left-and-the-resulting-terrain_fig1_274384740"
                    >[Quelle]</Link
                >
            </span> -->
        </ImageWithDesc>
    </Divider>

    Zur Überlagerung können entweder die Noisewerte addiert werden <ResourceReferenceElement
        reference={overlappingPerlinNoise}
    />, wodurch das Ergebnis deutlich ungleichmäßiger wirkt. Dieser Effekt ist
    beispielsweise bei der Generierung von Wolken ideal. Bei der Generierung von
    Landschaften jedoch ist eine gewisse Form von gleichmäßigkeit erwünscht. Die Erde ist
    grundsätzlich in ökologische Einheiten aufgeteilt, die durch ihre Pflanzen, Klima
    sowie allgemeines Aussehen definiert werden.
    <br />
    Um diese ökologischen Einheiten, auch als "Biome" bezeichnet, mittels Noise zu modellieren,
    muss eine Skalierte Variante gewählt werden, bei der die Zustandsänderung sehr langsam
    erfolgt. Dieser langsame Noise definiert den Biomtyp, aus dem dann weitere Eigenschaften
    abgeleitet werden können. In <ResourceReferenceElement
        reference={overlappingPerlinNoiseMax}
        showFullName={false}
    /> wird der größte Wert der verwendeteten Noise-Funktionen an einem Koordinatenpunkt gewählt.
    Die daraus entstehende Landschaft sieht dadurch deutlich natürlicher aus. Aus den Graustufen
    lassen sich die Biome "Gebirge" und "Weiden" modellieren, wobei die Gebirge hoch und "rau"
    sind und die Weiden geglättet und weich

    <div class="flex flex-wrap justify-evenly mt-7">
        <ImageWithDesc imageRef={overlappingPerlinNoise}>
            <NoiseExample
                {openModal}
                fragmentShader={FRAGMENT_SHADER_USING_PERLIN_COMBINED}
            />
        </ImageWithDesc>

        <ImageWithDesc imageRef={overlappingPerlinNoiseMax}>
            <NoiseExample
                {openModal}
                fragmentShader={FRAGMENT_SHADER_USING_PERLIN_COMBINED_MAX}
            />
        </ImageWithDesc>
    </div>

    In den Beispielen (<ResourceReferenceElement reference={overlappingPerlinNoise} />,
    <ResourceReferenceElement reference={overlappingPerlinNoiseMax} />) werden drei
    unterschiedlich skalierte Noise-Funktionen verwendet. In Minecraft werden verschiedene
    Noise-Funktionen verwendet, um physikalische Eigenschaften, wie z.B. Luftfeuchtigkeit
    und Temperatur zu simulieren. Aus Kombination dieser physikalischen Eigenschaften
    lassen sich dann realistisch Biome ermitteln. Eine hohe Temperatur und niedrige
    Feuchtigkeit führt beispielsweise zu einer Wüste, bei einer hohen Feuchtigkeit zu
    einem Regenwald (tropisch). Durch den physikalischen Aspekt wirkt die Platzierung
    benachbarter Biome logisch bzw. realistisch.
</Section>

<Section title="Programmierung">
    In der vorherigen Sektion wurde die prozedurale Landschaftsgenerierung erklärt und
    anhand von Webbeispielen (mittels Shadern) gezeigt. Jetzt sollen die theoretischen
    Grundlagen in Minecraft implementiert werden. Die Generierung soll innerhalb einer
    leeren Minecraft Welt geschehen. Dabei gibt es grundsätzlich zwei Hauptansätze, um in
    Minecraft (Java Edition) eigenen Code einschleusen zu können.
    <ul>
        <li>
            Erstellung von <Link
                href="https://minecraft.fandom.com/de/wiki/Modifikation/Mods_erstellen"
                >Client Modifikationen (Mods)</Link
            >
        </li>
        <li>
            Erstellung von <Link
                href="https://www.spigotmc.org/wiki/spigot-plugin-development/"
                >Server Modifikationen (Serverplugins)</Link
            >
        </li>
    </ul>
    Da die Entwicklung von Serverplugins deutlich einfacher für den gegebene Anwendungsfall
    ist, wird dieser Ansatz gewählt. Das Plugin wird in der Programmiersprache "Java" geschrieben
    und von dem Minecraft-Server "Spigot" verwendet.<br />
    In diesem Artikel wird die Programmierung eines Minecraft Plugins nicht weiter behandelt,
    der Source Code ist [hier] zu finden.
    <br /><br />
    Das Minecraft Plugin ruft die Funktion <Mark>buildWorld</Mark> auf, woraufhin die 100x100
    Block große Welt generiert wird. Der Algorithmus geht dabei wie folgt vor:

    <ol class="my-10">
        <CodeStep code={PERLIN_INIT}>
            <svelte:fragment slot="title">
                Initialisierung der Perlin Noise Objekte
            </svelte:fragment>
            <svelte:fragment slot="body">
                Als Parameter für den Perlin Noise Konstruktor wird ein Seed erwartet,
                also eine Zahl, die den Startwert des Pseudo-Zufallsalgorithmus bildet. In
                dem gegebene Codeschnipsel wird eine Zeichenkette gehashed und die daraus
                resultierende Zahl als Argument verwendet. Es stehen somit drei Perlin
                Noise Objekte zur Verfügung, bei den gleichen Eingabewerte jeweils
                unterschiedliche Noisewerte liefern.
            </svelte:fragment>
        </CodeStep>
        <CodeStep code={ITERATE_2D_COORDS}>
            <svelte:fragment slot="title">
                Iterierung durch die mögliche 2D Koordinaten
            </svelte:fragment>
            <svelte:fragment slot="body">
                Es werden verschiedene Felder gesetzt, wie die Größe der Welt (<Mark
                    >radius</Mark
                >), die Basishöhe der Landschaft (<Mark>terrain_base</Mark>) sowie die
                Y-Koordinate der tiefsten Schicht in der Welt<br /><br />
                Zum Schluss wird in einer verschachtelten Schleife für jede mögliche <Mark
                    >x</Mark
                > und <Mark>z</Mark> Koordinaten-Kombination die <Mark>calculate</Mark> Funktion
                aufgerufen. Die calculate-Funktion könnte theoretisch parallel aufgerufen werden
                und ist von der Denkweise ähnlich zu einem Shader.
            </svelte:fragment>
        </CodeStep>
        <CodeStep code={CALCULATE_TERRAIN_HEIGHT}>
            <svelte:fragment slot="title">
                Berechnung der Landschaftshöhe (oberste Schicht)
            </svelte:fragment>
            <svelte:fragment slot="body">
                Die Berechnung der Landschaftshöhe erfolgt, wie in <ResourceReferenceElement
                    reference={overlappingPerlinNoiseMax}
                    showFullName={true}
                /> dargestellt.

                <div class="flex justify-around items-center flex-wrap mt-8">
                    <ImageWithDesc imageRef={minecraftflatNoise}>
                        <img
                            width="200px"
                            height="200px"
                            src="slow/mcnoise.png"
                            alt="Flat Noise Minecraft"
                        />
                        <Viewer3d directory="slow" width={200} />
                    </ImageWithDesc>

                    <ImageWithDesc imageRef={minecrafthillyNoise}>
                        <img
                            width="200px"
                            height="200px"
                            src="hilly/mcnoise.png"
                            alt="Hilly Noise Minecraft"
                        />
                        <Viewer3d directory="hilly" width={200} />
                    </ImageWithDesc>
                </div>

                Durch Überlappung der beiden Noise-Funktionen (<ResourceReferenceElement
                    reference={minecraftflatNoise}
                />,<ResourceReferenceElement reference={minecrafthillyNoise} />) entsteht
                ein komplexes Modell (<ResourceReferenceElement
                    reference={minecrafthillyAndFlatNoise}
                    showFullName={false}
                />), bei dem, wie bereits erwähnt, letztendlich der Maximalwert an einer
                Koordinate genommen wird. Das Ergebnis aus diesen beiden Kombinationen ist
                vergleichbar mit dem Blick auf das Modell von oben.
                <br /><br />
                Erwähnenswert ist die unterschiedliche Skalierung der Noise-Funktionen. Bei
                <Mark>noise1</Mark>, dem "Flat Noise" (<ResourceReferenceElement
                    reference={minecraftflatNoise}
                />) werden die Koordinaten durch den Faktor 4 geteilt, wodurch die Noise
                Funktion langsamer fortschreitet. Die generierte Landschaft verändert sich
                dadurch schwächer. Das Ergebnis aus <Mark>noise2</Mark>, dem "Hilly Noise"
                (<ResourceReferenceElement reference={minecrafthillyNoise} />), wird im
                Gegensatz zu
                <Mark>noise1</Mark> mit einem größeren Faktor multipliziert, wodurch die generierte
                Landschaft stärker ausschlägt.

                <ImageWithDesc imageRef={minecrafthillyAndFlatNoise}>
                    <Viewer3d directory="slowAndHilly" width={200} />
                </ImageWithDesc>
            </svelte:fragment>
        </CodeStep>
        <CodeStep code={SET_TOPLEVEL_BLOCK}>
            <svelte:fragment slot="title">
                Setzen der obersten Blöcke & Wasser
            </svelte:fragment>
            <svelte:fragment slot="body">
                Nachdem die Y-Koordinate der obersten Schicht bestimmt wurde, können die
                Blöcke gesetzt werden. In diesem Schritt wird entschieden, ob der gesetzte
                Block vom Typ Grass, Sand oder Wasser sein soll. Falls <Mark
                    >flat_y<Nbsp />&lt<Nbsp />hilly_y</Mark
                > wurde die Y-Koordinate vom "Hilly Noise" beeinflusst. Auf hügeligen Landschaften
                sollen keine Seen oder Strände entstehen, weshalb direkt ein Grassblock gewählt
                wird. Ansonsten wird mittels einer dritten Noise-Funktion (<Mark
                    >water_noise</Mark
                >) der Blocktyp ermittelt. Da die Perlin Noise Implementation zwischen -1
                und 1 oszilliert, wird mit der Bedingung <Mark
                    >waternoise<Nbsp />&lt<Nbsp />0.4</Mark
                > für einen Grassblock der Zahlenbereich von <Mark
                    >-1<Nbsp />bis<Nbsp />0.4</Mark
                > eingeschlossen, also ein Großteil des Zahlenraums der Noise-Funktion. Somit
                werden die meißten Blöcke zu Grassblöcken. Liegt der Wert zwischen <Mark
                    >0.4</Mark
                > und <Mark>0.6</Mark> wird ein Sandblock gewählt, bei einem Wert größer als
                <Mark>0.6</Mark> ein Wasserblock. Durch diese Bedingungen wird um enstandenen
                Wasserblöcken immer Sandblöcke gesetzt, die Form des Sees und Strandes hängt
                von der Noise-Funktion ab. In <ResourceReferenceElement
                    reference={simulationTerrainGeneration}
                    showFullName={true}
                /> wird mitthilfe eines Shaders die behandelte Vorgehensweise zur prozeduralen
                Landschaftsgenerierung visualisiert. Die grauen Bereiche sollen Gebirge darstellen,
                grüne Flächen sind Graslandschaften, blau Seen und gelb Strände.

                <br /><br />
                Zur verbesserten Visualisierung wird wie in <ResourceReferenceElement
                    reference={perlinNoise3D}
                    showFullName={true}
                /> die Welt dreidimensional dargestellt. Kurz zur Funktionsweise des Shaders:
                Mittels JavaScript wird ein Mesh aus einem Triangle Strip generiert, wobei
                am Ende eine flache Plane erzeugt wird. Mittels eines Vertex Shaders wird durch
                Anwendung des oben beschriebenen Verfahrens die Höhe an einer Koordinate berechnet.
                Der Vertexshader transformiert somit zur Laufzeit die flache Plane, wodurch
                am Ende eine dreidimensionale Abbildung der Welt entsteht. Mit verschiedenen
                Rotationsmatrizen wird die Plane entsprechend gedreht. Die Plane wird schließlich
                vom Fragmenshader gemäß den übergebenen Höhenwerten bemahlt. Bei Interesse
                (wie bereits erwäht): Canvas Anklicken.
                <br /><br />

                <ImageWithDesc imageRef={simulationTerrainGeneration}>
                    <NoiseExample
                        width={500}
                        {openModal}
                        fragmentShader={FRAGMENT_SHADER_RESULTING_IN_WATER_ETC}
                    />
                    <div class="flex gap-2">
                        <NoiseExample
                            {openModal}
                            fragmentShader={""}
                            createShaderFn={createShaderWorldSimulation}
                        />
                        <div class="flex flex-col">
                            <h1>Control</h1>
                            <label>x</label>
                            <span>
                                <input type="range" min="0" max="90" bind:value={rotX} />
                                <span>{rotX}</span>
                            </span>
                            <label>y</label>
                            <span>
                                <input type="range" min="0" max="90" bind:value={rotY} />
                                <span>{rotY}</span>
                            </span>
                            <!-- <label>z</label>
                            <span>
                                <input type="range" min="0" max="90" bind:value={rotZ}/>
                                <span>{rotZ}</span>
                            </span> -->
                            <label>scale</label>
                            <span>
                                <input
                                    type="range"
                                    min="20"
                                    max="80"
                                    bind:value={scale}
                                />
                                <span>{scale}</span>
                            </span>
                        </div>
                    </div>
                </ImageWithDesc>
            </svelte:fragment>
        </CodeStep>
        <CodeStep code={BUILD_CAVES}>
            <svelte:fragment slot="title">Generierung der Höhlen</svelte:fragment>
            <svelte:fragment slot="body">
                Um dreidimensionale Höhlen in der virtuellen Welt zu erzeugen, wird
                zunächst mit der Erstellung eines soliden Würfels, der die Y-Achse der
                Welt vollständig mit Blöcken ausfüllt gestartet.

                <Divider>
                    <span slot="left">
                        Diese initiale Phase findet in den Zeilen <Mark>3-5</Mark> statt, wodurch
                        die Welt zunächst als ein massiver Kubus mit einer dynamisch hohen
                        Oberfläche erscheint. Die eigentliche Höhlengenerierung erfolgt durch
                        das 'Aushöhlen' dieses Kubus mittels 3D Perlin-Noise. Um realistischere
                        Höhlenformationen zu schaffen, variiert die Skalierung des Noises mit
                        zunehmender Tiefe. In den oberen Schichten werden kleinere Aushöhlungen
                        erzeugt, wobei die Höhlenöffnungen und -räume mit fortschreitender
                        Tiefe größer werden (Zeile <Mark>11</Mark>). In
                        <ResourceReferenceElement
                            reference={simulationTerrainGeneration}
                            showFullName={false}
                        /> wird das Negativ dieses 3D Noises visualisiert
                    </span>

                    <ImageWithDesc imageRef={minecraftCaves} slot="right">
                        <Viewer3d directory="caves" width={200} />
                    </ImageWithDesc>
                </Divider>

                Der Prozess der Weltbefüllung mit Blöcken (z.B. Erde und Stein) und der
                Höhlengenerierung wird durch den folgenden Code dargestellt:
            </svelte:fragment>
        </CodeStep>
    </ol>
    <Divider>
        <svelte:fragment slot="left">
            Die fertige virtuelle Welt sieht nach Durchführung der oberen 5 Schritte wie
            in <ResourceReferenceElement
                reference={minecraftAllTogether}
                showFullName={false}
            />
            aus. Dank der Unendlichkeit von Perlin Noise kann der Radius, in dem die Welt generiert
            wird, problemlos vergrößert werden. Die 100x100 Block große Welt ist somit lediglich
            ein Ausschnitt aus einer unendlich weitläufingen virtuellen Welt.
        </svelte:fragment>
        <ImageWithDesc imageRef={minecraftAllTogether} slot="right">
            <Viewer3d directory="alltogether" width={400} />
        </ImageWithDesc>
    </Divider>
</Section>

<Section title="3D Druck">
    Um einen Bereich aus einer Minecraft-Welt 3D-Drucken zu können, muss dieser zuerts in
    einen von einem Slicer verständlichen Format konvertiert werden. Mit dem Open-Source
    Tool <Link href="https://github.com/jmc2obj/j-mc-2-obj">J-mc-2-obj</Link>
    kann dies sehr leicht realisiert werden. Das Programm nimmt als Eingabe eine Minecraft
    Welt sowie den zu exportierenden Bereich, und gibt darauf eine Datei vom Typen <Mark
        >.obj</Mark
    > aus.
    <br />
    Diese Datei kann dann von einen beliebigen Slicer importiert werden. In meinem Fall verwende
    ich den kostenlosen <Link href="https://ultimaker.com/software/ultimaker-cura/"
        >Utimaker Cura</Link
    > Slicer. Zum Eigendruck hier der Link zur <Link href="alltogether/out.obj">.obj</Link
    > Datei und dem generierten <Link href="alltogether/EN4PRO_ComputerGrafikWorld.gcode"
        >G-Code</Link
    > (Optimiert für ELEGOO Neptune 4)

    <br /><br />
    <ImageWithDesc imageRef={curaWithItem}>
        <img src="FotoVonSlicerVorbereiten.png" />
    </ImageWithDesc>

    <br /><br />
    Nach 7-stündigem Drucken kann man die kleine selbstprogrammierte Minecraft-Welt in den
    Händen halten.

    <div>
        <img src="realimg/isometric.jpg" />
        <div class="flex imgshorizontal">
            <img src="realimg/close.jpg" />
            <img src="realimg/top.jpg" />
            <img src="realimg/cave.jpg" />
        </div>
    </div>
    <br /><br />
    <Section title="Extra: Haunted Island">
        Durch Verringerung der Höhenwerte mit zunehmender Distanz zum Mittelpunkt erreicht
        man, dass sich in der Mitte eine Hauptinsel bildet. Die Insel verändert sich mit
        Bewegung der Maus. Wie sich dem Code entnehmen lässt, sollte das ganze eigentlich
        ein simpler Raytracer werden, der Schatten erzeugt. Der ungewollt entstandene
        Effekt eines Geistes der um die Insel fliegt fande ich jedoch interessanter.
        <br /><br />

        <NoiseExample
            {openModal}
            fragmentShader={FRAGMENT_SHADER_USING_PERLIN_COMPLEX_ISLANDS}
        /><br />

        <br /><br />
        <sub
            >Auch sehr Interessant: <Link
                href="https://www.youtube.com/watch?v=na7LuZsW2UM">Video</Link
            ></sub
        >
    </Section>

    <h1>===ENDE===</h1>
</Section>

<style>
    .imgshorizontal {
        max-width: 33.33333%;
    }
</style>
