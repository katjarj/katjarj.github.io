# PROMPTS.md

Prompts given by the owner, verbatim (contact details redacted). Newest last. Agents: append each new prompt here.

1. i'm trying to create a personal website. some examples of design that i like are: https://lynnandtonic.com/, https://www.ilithya.rocks/, https://www.narrowdesign.com/ — i'm trying to mainly state what's in my resume on this website, i can also provide some extra details and whatnot. when making the repo for this, please ensure to maintain an instructions file for future agents to refer to if i ever switch to a different agent. also keep track of the prompts i've used for future reference in a prompts.md file. before creating the repo help me with the design of this website - would be cool if i included some kind of reference to skiing. maybe a mountain?? or do you think i should go a bit more minimalist like some of the reference sites i provided? font wise i'd like to stay away from the more generic looking fonts. colour wise as well. i dont want this to look like just any other site. i want it to be unique. help me with ideas before proceeding with the repo. we'll take our time. (Resume .docx attached; not committed.)
2. the hybrid sounds great! if theres a way to incorporate trees that are visibly some kind of spruce/pine (like the pacific northwest ski mountains i grew up in) that would be great. what tech stack is optimal for this?
3. does prompts.md have to be in all lowercase? i'd rather have both agents and prompts in the same case (i know it's nitpicky). is astro better than next.js here? i'm unfamiliar with it. can i deploy this using github pages instead of vercel or do you recommend i go with vercel? sure some tree sketches would be nice
4. let's go with the mix for now and we can pivot later. is there some way i need to name this repo upon creation for me to be able to put it as a github page?
5. we'll go with katjarj.github.io. remove my phone number and email, put in a contact form instead that will send to my personal email, [redacted], instead, without revealing what my email is
6. ok then for my links you can put in my linkedin and github.
7. don't put the form in anymore. instead of night session call it 'night ski'. everything else sounds good, build the repo and i can download it. are you able to build it as a like, zip file that i can download into repo form?
8. this site is too static. i want the site to look like a skier at the top of a ski hill. there's a big ski-style sign with multiple runs at the beginning, with a green run at the top with a left arrow labeled "work experience", a blue run with a forward-left labeled "personal projects", a black run with a forward-right arrow labelled "extracurricular", and a double black run with a right arrow labelled "skills". clicking on each section of the sign leads to a run (with animated motion leading in the right direction), and leads to what looks like a view from the top of the mountain, with overlayed text from my resume in that section. the skies should be blue during the day, and dark at night.
9. the landing page is alright for now (but the blue and black runs' arrows are not accurate, pls review and make them go up-left and up-right respectively) but the animation and individual sections are way off. the animation should start at the landing page and make it look like the person is going in the direction indicated on the sign they clicked. the page that each section leads to can look almost identical to the landing page, but instead of having a sign in the middle just have the text overlaid over the screen.
10. remove the frosted glass on each section, i can deal with contrast issues later. the animation is still incorrect, it needs to go directly from the landing page, moving in the direction of the respective arrow, through a continuous environment that lands at a duplicate version of the current landing page. the trees on the side of the landing page need to be bigger as well (and same goes for the sections then since they're dupes). the animation should also not rotate the screen as it currently does and it must be completely smooth
11. in this project all the animations are way way off, the trees are also improperly drawn. the animations, as you can see in the previous instructions in prompts.md, are supposed to be continuous from one page to the other.
12. overall looks significantly better. remove the lines in the snow and the movement that occurs when you move the mouse. also the bottoms of the trees render weirdly (they're pointy?)

also, love how the left and right arrows lead 2 scenes away, and the upper left and upper right arrows lead 1 scene away. now for the upper left and upper right, just make the animation go left/right directly without moving up at all. kind of like the left/right arrows but moving 1 scene instead of 2.
13. Run $PACKAGE_MANAGER run build

  > build
  > astro build

  Node.js v20.20.2 is not supported by Astro!
  Please upgrade Node.js to a supported version: ">=22.12.0"

  GitHub Actions CI Environment Detected!
  Additional steps may be needed to set your Node.js version:
  Documentation: https://docs.astro.build/en/guides/deploy/
14. add 2 more possible shades to the trees and increase the density on the left side. this way they dont all just blend together
15. some of the trees are floating. also move the shapes associated with the run to the right side of the sign section, and make them larger
16. make the trees more evenly spaced out and make the sign bigger
17. re read agents.md and remember to NOT commit files automatically anymore. never do that again.
18. remove the border from the sign sections. make the graphic more flat overall. move the two diamonds in the double-black closer together (slightly overlapping). remove the animation of the sign section growing when you hover on it
19. round the corners on the sign. move the double-black diamonds a little to the right. also bring the trees and sizing back
20. move the name down a little
21. before proceeding, re read agents.md. now you know i just want you to write code from now on, stop running stupid checks that take ages.

move the ski sign up toward the middle of the page
22. move the sign slightly down now
23. and move the name down an itty bit more
24. fix radius of the top two corners of the sign
25. make the double black diamond be the same height as the single diamond
26. make all the shapes (the circle, square, and diamonds) the same height, and make them all have the same center
27. make the double diamond overlap a bit more
28. make the square one pixel smaller it looks visually bigger
29. why not make some more ski signs that sort the sections into different bits? for example, for work experience, have it like: technical (green): software developer co-op, teaching assistant. non-technical (blue): ski instructor, math tutor, tech specialist. do not include my education in there
30. add a third (black run) part to work experience that says "Education". then rename work experience to Experience
31. no i want another sign where you can pick between technical, non-technical, and education (just like the landing page), and then each one leads you to a list
32. can you make it so that when theres three options (like the technical, non technical, education), the first option goes left, the second goes forward, the third goes right
33. can you add a fourth 'back' option pointing right? also do you think it should be double black or like a different colour for back
34. ok since theres four options on the experience page make it so it goes left, left-up, right-up, right, and make the animations match that
35. move the signs down and the name down a bit
36. make the two signs the same size (i want all the ski signs to look very similar)
37. now the top tab ('experience' or 'trail map') is full length, i dont want that. revert that
38. make my name bigger and a bit lower
39. would it be possible to extract the signs to its own component of some kind to reduce duplication as i add more? the reason i'm asking is so that when i add more signs to help separate out some of the other sections (for example maybe i will want to separate my skils into different categories) i can easily create a new sign that has the same styles and behaviour. also generalise back so a nested sign can return to its own parent sign rather than always the trail map
40. now separate the skills using a sign. the back button should point left (toward the parent) and the rest fill in the usual spots
41. remove the 'choose your run' bit
42. add my contact info at the bottom of the landing rather than in each individual page. remove the peachy colour, it's too low contrast.
43. instead of the golden brown for the top tab and 'back' button use the brown from the sign pole
44. make the dark brown border bit of the sign slightly thicker
45. ok well also increase the distance between each item in the sign























