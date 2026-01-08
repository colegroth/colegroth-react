const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'o0lkpygl',
  dataset: 'production',
  useCdn: false,
  token: 'skw0uw24IqpjOyUrClRgFQEFhd4Va50Y138P6TaAfMF5Mvj4zzYHe2u8FgkZrPs0kechrivk4i6vPkZIUu7KqcgAWIMqRUJHE32dHK2qOVPzkGuxttNQ1PgHII2qsxlTCZbXUqF3DsYu49JZX4uckTjKlJTZDE620suLHo0cycc6ttzeDYLi', // <--- PASTE YOUR TOKEN HERE
  apiVersion: '2025-12-31',
});

const rawReviews = [
  {
    id: "002-Influencers",
    slug: "influencers",
    title: "Influencers",
    director: "Kurtis David Harder",
    year: "2025",
    ratingStars: "★★★½",
    publishedDate: "Dec 12, 2025",
    heroImage: "https://image.tmdb.org/t/p/original/hi2tVK3wT1J2Mh0gJDKUVowRmjN.jpg",
    verdict: "A grim, voyeuristic thrill.",
    isFeatured: false,
    paragraphs: [
      "<i>Influencers</i> arrives as a shock to the system, proving itself to be an even more startling beast than its predecessor. In many respects, this represents a significant evolution for the franchise. I admire the expanded scope of the production. Director Kurtis David Harder wisely opens up the world, exploring fresh narrative perspectives without simply retracing the bloody steps of the original film. He honors the foundation he built while forcefully shoving the story in a new, more chaotic direction.",
      "The film stumbles slightly when it tries to tackle the broader cultural conversation. Harder attempts to skewer the rising tide of right-wing radicalization online, but these satirical jabs often lack precision. He swings a dull sword at these targets where a scalpel is required. The commentary feels broad where it should be surgical, aiming for easy mockery rather than dissecting the terrifying nuance of how these ideologies actually spread. Despite this bluntness, the film remains a mighty effective thriller because the tension never evaporates.",
      "Everything is anchored by the magnetic Cassandra Naud. She dominates every frame she inhabits with a performance that is both terrifying and alluring. She's a void who pulls people in. The supporting cast is not merely cannon fodder, either. The victims and accomplices who orbit Naud’s character are fully realized people, making their inevitable fates sting that much more. Watching the trap close around them provides a grim, voyeuristic thrill that keeps the pacing tight.",
      "I remain torn on the conclusion. It offers a catharsis that the first film denied us, yet that very satisfaction feels like a concession. The original <i>Influencer</i> left the audience with a cold, unresolved knot in their stomach. This sequel opts for a cleaner resolution. It makes for a more traditional movie-going experience, but it sacrifices the jagged, dangerous edge that made the first film feel so singular. Harder is clearly a talented director who knows how to manipulate an audience, even if he played it a little safer this time around."
    ],
    quotes: ["She's a void who pulls people in."],
    stills: [
      "https://image.tmdb.org/t/p/original/9LJPquWvG43sKvK412qFoFsaiXi.jpg",
      "https://image.tmdb.org/t/p/original/ro7o9Z5dx9ZRv2209t1sylg5qs4.jpg"
    ]
  },
  {
    id: "003-EllaMcCay",
    slug: "ella-mccay",
    title: "Ella McCay",
    director: "James L. Brooks",
    year: "2025",
    ratingStars: "★★",
    publishedDate: "Dec 12, 2025",
    heroImage: "https://media.themoviedb.org/t/p/w1000_and_h563_face/ucOhZSrh18fGk762Yf3wm0REa6C.jpg",
    verdict: "Staggeringly embarrassing.",
    isFeatured: false,
    paragraphs: [
      "<i>Ella McCay</i> is one of the most staggeringly embarrassing dramas I have ever endured. It is so misguided that I found myself laughing in disbelief at how many steps this film manages to miss. Out of every second of its agonizing 115-minute runtime, the only faint praise I can offer is that Emma Mackey is only half bad.",
      "It is difficult to articulate the sheer scale of the failure on display here, but most of it rests on the shoulders of Ella McCay herself. James L. Brooks inexplicably frames her as a hollow, neoliberal caricature reminiscent of a 2008 campaign ad. This feels incredibly bizarre given that the film is being released in 2025. We are asked to root for a young legislator with zero political drive and a history of anti-marijuana advocacy. She is simply not a character worthy of our time.",
      "Ella is a bumbling and inept woman surrounded by a gallery of aggressively antagonistic cartoons. The supporting cast seems designed to drag the story into the mud. You have her father, a wretched man trying to atone for past mistakes who never earns a shred of forgiveness. You have her husband, who is evil to the point of absurdity as he schemes to destroy Ella for his mother's political gain. You have her boss, who helps her become governor while openly insulting her to her face. Ella does not fight back. She just takes it.",
      "She might be one of the most pathetic protagonists on planet Earth. This is the source of the film's deepest frustration. We are watching an incompetent person, whom the movie insists is intelligent, stumble her way through a massive political victory only to conclude that she should quit while she is ahead.",
      "The narrative is a chaotic mess. Despite introducing numerous bizarre side characters who vanish after a single scene, the film tries to present itself as a sweeping story of a woman under pressure. It ends up feeling like a modern <i>Idiocracy</i> populated by mean-spirited idiots who are unworthy of the oxygen they breathe.",
      "The film carries some of the most toxic messaging I have ever seen and stands as one of the most insulting viewing experiences of my life. I typically reserve a one out of ten rating for films with zero redeeming qualities. While <i>Ella McCay</i> has the production value of a real movie, I cannot forgive a two-hour film that accomplishes so little in such a frustrating manner. It is, in no uncertain terms, one of the worst movies of the 21st century."
    ],
    quotes: ["It is, in no uncertain terms, one of the worst movies of the 21st century."],
    stills: [
      "https://media.themoviedb.org/t/p/w1000_and_h563_face/rrqIYrYwlk1iv2Tef6vfYlIid2o.jpg",
      "https://media.themoviedb.org/t/p/w1000_and_h563_face/oHKKUqxXZ8mhSPJtVrzyPBssoHc.jpg"
    ]
  },
  {
    id: "004-Eternity",
    slug: "eternity",
    title: "Eternity",
    director: "David Freyne",
    year: "2025",
    ratingStars: "★★★½",
    publishedDate: "Nov 26, 2025",
    heroImage: "https://via.placeholder.com/1920x1080?text=Eternity+Image+Pending", 
    verdict: "A warm embrace.",
    isFeatured: false,
    paragraphs: [
      "Critics love to declare the romantic comedy a dead genre. They dismiss it as a collection of tired gimmicks. I feel sorry for those people. I have always championed high concept romances like <i>Palm Springs</i> or <i>13 Going on 30</i> because they use a sci-fi framework to amplify real human emotions. <i>Eternity</i> succeeds by doing exactly that. It takes a fantastical choice between two different afterlives and turns it into a film that feels like a warm embrace. It treats its absurdity with respect and finds the human heart underneath.",
      "Director David Freyne balances the tone with a sure hand. The movie operates with the specific, addictive intrigue of a Korean drama where you desperately need to know who ends up with whom. The mechanics of the afterlife actually assist the narrative here. The characters use archives to view their memories and must walk through physical doors to lock in their eternity. These rules give the romance stakes beyond simple feelings. The choice becomes physical and permanent.",
      "Miles Teller is a tricky casting choice for a romantic lead. He possesses a natural abrasiveness that can often keep an audience at arm's length. Elizabeth Olsen completely disarms him. She brings such a profound sincerity to the role of Joan that Teller has no choice but to drop his guard. There is a quiet scene where they simply look at each other in the Junction bar. In that moment, you believe immediately that these two people could tolerate each other for a literal eternity. Olsen anchors the high concept antics in reality.",
      "The film feels remarkably consistent in its atmosphere. It maintains a sweet, slightly melancholic vibration from start to finish. It reminds me of <i>Palm Springs</i>, though perhaps with less existential dread and more sentimental longing. I admit that I got swept up in the intrigue of it all. I wanted to see who she picked. I wanted the happy ending. <i>Eternity</i> proves that a movie does not need to redefine the medium to be great. It just needs to make you care about the people on the screen."
    ],
    quotes: ["It treats its absurdity with respect and finds the human heart underneath."],
    stills: [
      "https://via.placeholder.com/1000x560?text=Eternity+Still+1",
      "https://via.placeholder.com/1000x560?text=Eternity+Still+2"
    ]
  },
  {
    id: "005-Hamnet",
    slug: "hamnet",
    title: "Hamnet",
    director: "Chloé Zhao",
    year: "2025",
    ratingStars: "★★★★½",
    publishedDate: "Nov 26, 2025",
    heroImage: "https://media.themoviedb.org/t/p/w1000_and_h563_face/yt9m5CiU2MZkQoNl1kqLPODNR4t.jpg",
    verdict: "A masterpiece of mood.",
    isFeatured: false,
    paragraphs: [
      "Chloé Zhao is great at filming landscapes that act like characters. In <i>Hamnet</i>, the English countryside is far more than a pretty backdrop for a period piece. You can feel the mud and smell the rain. Most historical dramas feel like they were shot on a polished soundstage. This film feels like it was dug out of the earth. The natural lighting and the grime give the story a roughness that’s rare in modern cinema.",
      "Paul Mescal continues his streak of incredible performances. He plays William Shakespeare, but the film wisely decides that his fame is irrelevant. He’s just a father here. Mescal carries the weight of his talent like a physical sickness. He does more with his eyes in this film than most actors do with a ten-page monologue. The story of the hawk anchors his connection to the family. It’s a simple metaphor about wishes, and Mescal sells it with heartbreaking sincerity.",
      "Critics might call the film one-note, but they are missing the point. The movie is less of a story and more of a long, heavy sigh. It avoids becoming misery porn because it finds beauty in that sadness. The flashbacks to the children playing, specifically the bond between Hamnet and Judith, are full of life. The tragedy hits harder because the joy felt so real.",
      "The most powerful element is the quiet. We are watching a movie about the greatest writer in the English language, yet the dialogue is sparse. Zhao trusts her images. She trusts Jessie Buckley, who gives perhaps the best performance of the year as Agnes. The silence between the characters screams about the distance death puts between the living. <i>Hamnet</i> is a gorgeous, devastating piece of work that captures the specific weight of losing a child. It’s a masterpiece of mood."
    ],
    quotes: ["This film feels like it was dug out of the earth."],
    stills: [
      "https://media.themoviedb.org/t/p/w1000_and_h563_face/ze52pV19q7b61SAB4n1Zhn2aMr3.jpg",
      "https://media.themoviedb.org/t/p/w1000_and_h563_face/a9IQXoYCpsjqTOKXRTw1osLd5il.jpg"
    ]
  },
  {
    id: "006-NYSM3",
    slug: "now-you-see-me-now-you-dont",
    title: "Now You See Me: Now You Don't",
    director: "Ruben Fleischer",
    year: "2025",
    ratingStars: "★★★★",
    publishedDate: "Nov 14, 2025",
    heroImage: "https://image.tmdb.org/t/p/original/yZVNfNJ3dZxACmlu1HmgB0CXn9O.jpg",
    verdict: "Magic with weight.",
    isFeatured: false,
    paragraphs: [
      "Ruben Fleischer performs a sleight of hand in <i>Now You See Me: Now You Don’t</i> that is more impressive than any card trick. He takes a franchise that was suffocating under the weight of its own digital excess and gives it oxygen. The title sounds like a threat, that the fun might vanish, but the result is the opposite. This movie exists in a tactile world. It breathes. It’s the sequel I did not know I wanted, and it revitalizes the series in a way legacy sequels rarely achieve.",
      "The director gambles everything on a fresh deck: Dominic Sessa, Ariana Greenblatt, and Justice Smith. it's a risk to ask us to look away from the established stars, yet I found myself unable to look away from these three. Sessa has a face that seems permanently skeptical, bringing a jagged, nervous energy that anchors the group. Greenblatt is the steel spine, and Smith offers a neurotic humanity that the previous films often lacked. Because the group is smaller, three distinct souls rather than a revolving door of five or six archetypes, we actually see them. We learn their rhythms. It creates a texture of camaraderie that feels lived-in, not scripted.",
      "I have often complained that the previous entries in this saga felt less like films about magicians and more like films about wizards. The characters did things that physics would not allow, and the computer-generated imagery washed away any sense of awe. Fleischer grounds this film. When a card is thrown, it moves through the air with weight. The pacing has a snap to it, like a rubber band against the wrist. it's consistently entertaining because it respects the mechanics of the illusion. It redefines the franchise by treating magic as a trade rather than a superpower.",
      "Do not misunderstand me; the film pays its dues. The original Horsemen return, and their presence is handled with a dignity that feels earned rather than contractually obligated. It bridges the gap between the generations without stumbling. I could watch this series continue with the old guard, or the new, or both. The machine works again.",
      "If there is a fault, it’s in the scale. The movie pulls back from the global stakes of its predecessors. Yet, I argue this is a strength. By lowering the volume, the film allows us to hear the characters speak. It feels intimate. It feels grounded.",
      "I walked out of the theater feeling a specific kind of satisfaction. I’m scheduled to interview Ruben Fleischer this Thursday, and I find myself eager to ask about how he got it all done. This is the first time I have seen this series on the big screen, and the experience instilled a confidence in me I did not expect. I cannot wait to see where the fourth film goes. On its own, however, this is a remarkable piece of entertainment."
    ],
    quotes: ["It redefines the franchise by treating magic as a trade rather than a superpower."],
    stills: [
      "https://media.themoviedb.org/t/p/w1000_and_h563_face/4iAWAvbjJcgCYpd4T8bSifxpweZ.jpg",
      "https://media.themoviedb.org/t/p/w1000_and_h563_face/tvDx5r5D4lrNKD2PavLhx2sFnT6.jpg"
    ]
  },
  {
    id: "007-WakeUpDeadMan",
    slug: "wake-up-dead-man",
    title: "Wake Up Dead Man",
    director: "Rian Johnson",
    year: "2025",
    ratingStars: "★★★★½",
    publishedDate: "Dec 12, 2025",
    heroImage: "https://media.themoviedb.org/t/p/w1000_and_h563_face/cOqbSanG5jdXZHf8HNl71YHg9bi.jpg",
    verdict: "A beautiful puzzle box.",
    isFeatured: false,
    paragraphs: [
      "My father despised <i>Wake Up Dead Man</i>. He is precisely the sort of religious dogmatist Rian Johnson targets with such glee here. He took every joke as a slap to the face, which serves as the ultimate proof that the film works. Johnson isn’t mocking faith; he is mocking the performance of faith. He targets the hypocrites who wear the cross like a shield while reaching for your wallet. If you feel targeted by this picture, you likely deserve to be.",
      "In a room full of screaming caricatures, Josh O'Connor is a whisper that commands attention. He is the revelation here. He plays Father Jud with a quiet intensity and the weary eyes of a man who actually believes in forgiveness. He provides a grounded, quiet strength that the rest of the ensemble lacks. He’s the moral ballast. Without him, the satire would float away into the ether of pure absurdity. He represents the genuine article, the true believer, standing in judgment of the frauds who surround him.",
      "Visually, this is the most striking entry in the trilogy. <i>Knives Out</i> felt like damp wool and autumn leaves. <i>Glass Onion</i> was an assault of sterile orange and blinding azure. <i>Wake Up Dead Man</i> is steeped in the heavy, suffocating purples and crimsons of stained glass. The lighting is daring. Steve Yedlin shoots the rural parish like a Gothic painting that has started to melt. These shadows do not just hide clues; they hide sins. The composition adds a layer of dread that curdles the comedy into something substantial.",
      "Johnson delights in the frustration of his audience. He introduces Cailee Spaeny, makes her seem vital, and then reveals her to be smoke. This is intentional. We want every detail to fit, but life, and murder, is full of noise. Johnson respects us enough to lie to us. The mystery is solid, the solution satisfies, and the social commentary leaves teeth marks. It is exactly what a <i>Knives Out</i> mystery should be: a beautiful puzzle box that bites your fingers when you try to solve it."
    ],
    quotes: ["These shadows do not just hide clues; they hide sins."],
    stills: [
      "https://media.themoviedb.org/t/p/w1000_and_h563_face/fSNZCHoHUrAtd6kc2PXV9pnAZU1.jpg",
      "https://media.themoviedb.org/t/p/w1000_and_h563_face/kSo1RFOWTyzEoXkKuetx2aPJas3.jpg"
    ]
  },
  {
    id: "008-MartySupreme",
    slug: "marty-supreme",
    title: "Marty Supreme",
    director: "Josh Safdie",
    year: "2025",
    ratingStars: "★★★★★",
    publishedDate: "Dec 25, 2025",
    heroImage: "https://media.themoviedb.org/t/p/w1000_and_h563_face/jBOhqsbzEL7Ks3NWy98iI7YDzBh.jpg",
    verdict: "Nerve-wracking excitement.",
    isFeatured: true, // <--- FORCED TO FRONT
    paragraphs: [
      "Dreaming big is the common theme among the only truly great movies of 2025. From the folklore in <i>Sinners</i> to the enormous scale of <i>Mission: Impossible – The Final Reckoning</i>, and now the nerve-wracking excitement of <i>Marty Supreme</i>, this year's five-star films are all Capital M Movies™.",
      "It doesn't take long to realize Josh Safdie created something magical here. Everyone on this project is firing on all cylinders. The experience is like that line in <i>Tenet</i>: 'Don't try to understand it, feel it.' Even when the pacing is erratic, Safdie’s guiding hand ensures you grasp the emotional stakes perfectly. It’s like taking a pill that suddenly grants you fluency in Chinese.",
      "Every year people doubt Timothée Chalamet, and every year he delivers a superior performance. Nothing touches what he achieves here physically and comedically. He makes Marty simultaneously likable and obnoxious, carrying a boyishness that only gains maturity through his constant rejection of it. He finally matures when he’s getting humiliated by Kevin O’Leary, but the shift feels natural rather than a script mandate. Watching him actually play ping pong is sensational. In a way, I’m half hoping the weaker performance from DiCaprio beats him at the Oscars just so Chalamet feels encouraged to top himself next year.",
      "The supporting cast is equally stellar. I loved Odessa A’zion’s arc; even when her scheming ends up being futile, the fact that she believes it's vital is what matters. It’s a sharp look at how a person's purpose can be mundane to an outsider but essential to them. Between her, Gwyneth Paltrow, and Tyler, the Creator, you see everyone embracing that “dream big” moniker in non-traditional ways.",
      "It’s a joyful experience from top to bottom that actually lives up to its own marketing. It doesn't quite surpass <i>Sinners</i>, but it's remarkably close. Incredible work."
    ],
    quotes: ["It’s like taking a pill that suddenly grants you fluency in Chinese."],
    stills: [
      "https://media.themoviedb.org/t/p/w1000_and_h563_face/jT8P4cc3C4Tm1vDz9DfPkvPSajo.jpg",
      "https://media.themoviedb.org/t/p/w1000_and_h563_face/74SjgNVivrrWQBVf0jSxn0pMK9t.jpg"
    ]
  },
  {
    id: "009-AvatarFireAndAsh",
    slug: "avatar-fire-and-ash",
    title: "Avatar: Fire and Ash",
    director: "James Cameron",
    year: "2025",
    ratingStars: "★★★★",
    publishedDate: "Dec 19, 2025",
    heroImage: "https://media.themoviedb.org/t/p/w1000_and_h563_face/pN3eaCl3sqwrerU8UNdp40F2mK0.jpg",
    verdict: "A high-end aquarium.",
    isFeatured: false,
    paragraphs: [
      "James Cameron is a wizard with a soldering iron who still thinks like a silent film director. In <i>Avatar: Fire and Ash</i>, he builds a world of staggering physical detail just to stage a glorified puppet show. Pandora doesn’t look like CGI anymore. It looks like a place where the humidity would actually rot your boots. The water has surface tension, and the skin on these Na’vi has an astonishing fidelity that makes every other blockbuster look like a cartoon. But despite the billion-dollar coat of paint, I couldn't shake the feeling that I was staring at a very high-end aquarium. The tech is lightyears ahead, yet the script is still crawling through the mud.",
      "The Ash People, the Mangkwan, finally give the franchise a much-needed kick in the teeth. While the Metkayina were all about harmony and flowing water, these newcomers are scorched earth and jagged obsidian. They replace the soft blues of the previous movies with a palette of soot and dried blood. Oona Chaplin is terrifying as Varang. She doesn't have a shred of the typical Na’vi nobility; she’s pure, vibrating malice. It’s a massive relief to see that the indigenous people of Pandora can be just as much of a nightmare as the humans.",
      "However, the movie hits a wall with Miles Quaritch. He’s basically a persistent rash at this point. Because he can just keep coming back in new bodies, his death loses all meaning. Quaritch is basically a recurring boss fight in a game where you can't save your progress, which makes him feel less like a character and more like a nuisance. While the Sully kids are actually dealing with the messy reality of grief and growing up, Quaritch is stuck in a loop of shouting and shooting. It’s boring. No amount of fire or debris can hide the fact that the stakes evaporate when the villain has an infinite lives cheat code.",
      "There's also something off with the frame rate.. Cameron is still obsessed with switching between 48 frames per second for action and 24 for conversation. It’s a disaster for the eyes. It feels like someone is toggling the motion smoothing on your TV every five minutes. One second you’re watching a movie, and the next you’re watching a behind-the-scenes documentary or a soap opera. It breaks the spell of the world every single time the camera slows down.",
      "As a bridge between films, it does the job. It settles the family drama for now, even if the actual war for the planet hasn't moved an inch. We're essentially running on a very expensive treadmill. The view is spectacular, and you can’t look away from the craftsmanship, but you leave the theater feeling like you’ve traveled ten thousand miles without actually going anywhere."
    ],
    quotes: ["We're essentially running on a very expensive treadmill."],
    stills: [
      "https://media.themoviedb.org/t/p/w1000_and_h563_face/x3lDB2jEHnWciBz0W1tARG3gJs6.jpg",
      "https://media.themoviedb.org/t/p/w1000_and_h563_face/ssDkCOqg6uSJH5o6TicNdWHnG3f.jpg"
    ]
  }
];

async function migrate() {
  console.log(`Migrating ${rawReviews.length} feature reviews...`);
  const transaction = client.transaction();

  rawReviews.forEach(rev => {
    const doc = {
      _type: 'featureReview',
      title: rev.title,
      id: rev.id,
      slug: { _type: 'slug', current: rev.slug },
      director: rev.director,
      year: rev.year,
      ratingStars: rev.ratingStars,
      publishedDate: rev.publishedDate,
      heroImage: rev.heroImage,
      verdict: rev.verdict,
      paragraphs: rev.paragraphs,
      quotes: rev.quotes,
      stills: rev.stills,
      isFeatured: rev.isFeatured,
      footerText: rev.title + " is in theaters now",
    };
    transaction.create(doc);
  });

  await transaction.commit();
  console.log("Migration complete!");
}

migrate().catch(console.error);