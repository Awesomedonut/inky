export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white border border-gray-300 rounded p-6">
        <h1 className="text-2xl font-bold text-teal-900 mb-4">About Inky</h1>

        <div className="prose max-w-none text-gray-700 space-y-4">
          <p>
            Welcome to Inky (name tentative), a writing archive for sharing and reading creative work!
            The site is currently a prototype and interest check.
          </p>

     
          <p>
            Inky is heavily inspired by AO3, but built with a stricter focus on
            creator safety. The project started after seeing many
            conversations about hate spam, botted comment abuse, and the spread
            of NSFW underage RPF content.
          </p>
    

          <h2 className="text-lg font-semibold text-teal-800 mt-6">My principles</h2>
         <ul>
              <li>No NSFW content of minors</li>
  <li>Free to use</li>
  <li>No ads</li>
   <li>No trackers</li>
    <li>Strong protection against bot spam</li>
    <li>Writers own their content</li>
  
</ul>

          <h2 className="text-lg font-semibold text-teal-800 mt-6">Contact</h2>
          <p>
            I'm at @greenstick1234 on twitter and u/foodiepower on reddit!
            Feedback, suggestions, comments, bugs, etc all appreciated! 
            
            If you wanna volunteer and help, that would be amazing!
            
        
          </p>
        </div>
      </div>
    </div>
  );
}
