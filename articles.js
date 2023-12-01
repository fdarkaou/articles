
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = ' ';
const supabaseAnonKey = ' ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

//// AZURE OpenAI Service
import {OpenAIClient, AzureKeyCredential } from "@azure/openai";
const endpoint = '' ;
const azureApiKey = '' ;

// For getting unsplash images
import fetch from 'node-fetch';
// import fetch from 'node-fetch';

async function generateBlogIdeas(numIdeas, language, topic) {
  try {
    const prompt = `Generate ${numIdeas} unique and highly specific blog post ideas in ${language} that address frequently asked questions in one of the following fields: ${topic}. Articles titles generated should have a good mix of adressing a single topic or a combination of topics mentioned earlier. Each response should only contain a title that encapsulates an intriguing or complex issue within the topic area.\n`;
  
    console.log(prompt);
  
    const messages = [
      { "role": "system", "content": "You are a creative blog idea generator." },
      { "role": "user", "content": prompt }
    ];
  
    const functions = [
      {
        "name": "generate_blog_titles",
        "description": "This function generates blog post titles.",
        "parameters": {
          "type": "object",
          "properties": {
            "blogTitles": {
              "type": "array",
              "minItems": numIdeas,
              "items": {
                "type": "string",
                "description": "A single blog post title."
              }
            }
          },
          "required": ["blogTitles"]
        }
      }
    ];
  
    console.log("== Chat Completions Sample ==");
  
    const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
    const deploymentId = "YOUR AZURE DEPLOYMENT ID GOES HERE";
    const result = await client.getChatCompletions(deploymentId, messages, functions);
  
    let responseData;
  
    for (const choice of result.choices) {
      console.log(choice.message.content);
      responseData = choice.message.content;
    }
  
    const blogIdeas = responseData.split("\n").map(idea => idea.replace(/^[0-9]+\. /, "").trim());
    return blogIdeas;
  
  } catch (err) {
    console.error("API call failed: ", err);
    return null;
  }
}  

async function generateArticles(title, languague) {

  try {
    const prompt = (
      `You are ${languague} CopyGPT, skilled in crafting high-quality, well-structured articles in ${languague}. Start from the initial idea with the title: ${title}. Generate an SEO-optimized article in JSON format with the following directives:\n\n`
      + "- SEO KEYWORDS:\n"
      + `Based on the initial title "${title}", identify and incorporate one or two SEO-targeted keywords that are highly relevant to the subject matter.\n\n`
      + "- TOPIC:\n"
      + `Your starting point is the title: ${title}. Develop an article that provides in-depth answers to common questions and insights related to this topic.\n\n`
      + "- SEO INFORMATION:\n"
      + "Generate an alternative title that is less than 60 characters and a subtitle less than 148 characters. Include both in the JSON.\n\n"
      + "- WORD COUNT & STRUCTURE:\n"
      + "Create an article of AT LEAST 2000 WORDS consisting of a variable number of detailed blocks (minimum 4). Utilize HTML markup and TailwindCSS for rich structuring, such as ordered lists, tables, etc.\n\n"
      + "- WRITING STYLE:\n"
      + "Write in short, easily readable sentences. Use `<br>` tags to add sufficient spacing between sentences. The style should be like this example:\n"
      + '"Google’s search results change constantly – and so do the websites within these search results.<br>\n'
      + 'Most websites in the top 10 results on Google are always updating their content.<br>\n'
      + 'It’s important to track these changes and spot-check the search results. This informs future updates.<br>\n'
      + 'Having a regular review of your site is crucial for staying updated and competitive."<br>\n\n'    
      + "- JSON STRUCTURE:\n"
      + "`title` (String): An SEO-optimized title that is less than 60 characters.\n"
      + "`subtitle` (String): SEO-optimized subtitle that is under 148 characters.\n"
      + "`pictureKeywords` (String): English keywords. These keywords will be used to search for a fitting picture to include in the article. Keywords should ONLY focus on the unique, distinguishing elements of the article's title. DO NOT use generic keywords like 'AI', 'fotos de perfil', 'inteligencia artificial', or 'algoritmos de IA'. For example, if the title is 'La Inteligencia Artificial: Revolucionando la Creación Artística de Imágenes', the keywords should be 'Artistic Creation, Art'. If the title is 'Cómo la IA está Cambiando la Fotografía de Naturaleza', the keywords should be 'Nature Photography'.\n"
      + "`blocks` (Array): Each block should contain 'text', 'image', and 'subtitle'.\n"
      + "  - `text` (String): Article text for this block. NO H2 TAGS. NO subtitles. Article text only. For example:\n"
      + '  "<p class="mb-5">La era digital ha revolucionado...</p><p class="mb-5">El término \'DeepFake\' proviene...</p>"\n'
      + '  "<ol class=\'list-decimal list-inside\'><li>Point 1</li><li>Point 2</li></ol><p>Further elaboration...</p>"\n'
      + "  - `image` (String): URL of the image for this block. This should ALWAYS be null.\n"
      + "  - `subtitle` (String): Subtitle for this block. For example: 'Introducción'\n\n"
      + "VERY IMPORTANT: Adhere strictly to the JSON format and guidelines.\n"
      + "VERY IMPORTANT: Content should be original and unique.\n"
      + "VERY IMPORTANT: The `text` should NOT contain subtitles. DO NOT ADD H2 TAGS IN THE `text` SECTION.\n"
      + "VERY IMPORTANT: DO NOT INCLUDE H2 TAGS IN THE `text` FIELD. ONLY USE <p>, bullet points, tables and so on.\n"
      + "VERY IMPORTANT: For `title` should be less than 60 characters and `subtitle` should be less than 148 characters.\n"
      + "VERY IMPORTANT: For `pictureKeywords`, focus on unique, distinguishing elements specific to the title. Keywords must be in English and highly specific.\n"
      + `VERY IMPORTANT: The article should be in ${languague}.\n`
    );
    
    
    
    console.log("Generating article for:", title);
  
    const messages = [
      {"role": "system", "content": "You are a talented writer."},
      { "role": "user", "content": prompt }
    ];
  
    const functions = [
      {
        "type": "object",
        "properties": {
          "title": {
            "type": "string",
            "maxLength": 60,
            "description": "SEO-optimized title of the article."
          },
          "subtitle": {
            "type": "string",
            "maxLength": 148,
            "description": "SEO-optimized subtitle of the article."
          },
          "pictureKeywords": {
            "type": "string",
            "description": "English keywords. These keywords will be used to search for a fitting picture to include in the article. Keywords should ONLY focus on the unique, distinguishing elements of the article's title. DO NOT use generic keywords like 'AI', 'fotos de perfil', 'inteligencia artificial', or 'algoritmos de IA'. For example, if the title is 'La Inteligencia Artificial: Revolucionando la Creación Artística de Imágenes', the keywords should be 'Artistic Creation, Art'. If the title is 'Cómo la IA está Cambiando la Fotografía de Naturaleza', the keywords should be 'Nature Photography'."
          },
          "blocks": {
            "type": "array",
            "minItems": 4,
            "items": {
              "type": "object",
              "properties": {
                "text": {
                  "type": "string",
                  "minLength": 1,
                  "description": "Article text for this block."
                },
                "image": {
                  "type": "string",
                  "format": "uri",
                  "description": "URL of the image for this block."
                },
                "subtitle": {
                  "type": "string",
                  "description": "Subtitle for this block."
                }
              },
              "required": ["text", "subtitle"]
            }
          }
        },
        "required": ["title", "subtitle", "blocks"]
      }
      
    ];
  
    console.log("== Chat Completions Sample ==");
  
    const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
    const deploymentId = "WorkoutPro";
    const result = await client.getChatCompletions(deploymentId, messages, functions);
  
    let responseData;
  
    for (const choice of result.choices) {
      console.log(choice.message.content);
      responseData = choice.message.content;
    }
    let jsonData = JSON.parse(responseData);

    console.log(jsonData.pictureKeywords)
    const unsplashResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${jsonData.pictureKeywords}&client_id=YOUR UNSPLASH API KEY GOES HERE`
    );
    const unsplashData = await unsplashResponse.json();
    const randomIndex = Math.floor(Math.random() * unsplashData.results.length);
    const imageUrl = unsplashData.results[randomIndex].urls.small;
        
    console.log(imageUrl)


    // Write the result to Supabase...
    const { error } = await supabase
      .from('blog')
      .insert([
        {
          title: jsonData.title,
          subtitle: jsonData.subtitle,
          blocks: jsonData.blocks,
          image: imageUrl,
        }
      ]);

    if (error) {
      console.error('Error updating Supabase:', error);
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

async function generateBlogsAndStore() {
  try {
    // Step 1: Generate X blog ideas
    const numIdeas = 50;
    const language = "English";
    const topic = "build in public, digital product, indiehacker, solopreneur, ai, digital nomad, productivity, ...";
    const blogIdeas = await generateBlogIdeas(numIdeas, language, topic);
  
    if (!blogIdeas || blogIdeas.length === 0) {
      console.error("No blog ideas generated.");
      return;
    }

    console.log('\n\n\n')
  
    // Step 2: For each idea, generate an article and store it in Supabase
    for (const title of blogIdeas) {
      await generateArticles(title, language); 
    }
  
  } catch (error) {
    console.error("Error in generateBlogsAndStore:", error);
  }
}
generateBlogsAndStore();


// TO DO: add filtering tags to the blog posts