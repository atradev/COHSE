package uk.co.nasko.jersey.jaxb.model;


import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.erasmusmc.data_mining.ontology.api.Concept;
import org.erasmusmc.data_mining.ontology.api.Label;
import org.erasmusmc.data_mining.ontology.api.Language;
import org.erasmusmc.data_mining.ontology.api.Ontology;
import org.erasmusmc.data_mining.ontology.common.LabelTypeComparator;
import org.erasmusmc.data_mining.ontology.impl.file.SingleFileOntologyImpl;
import org.erasmusmc.data_mining.peregrine.api.IndexingResult;
import org.erasmusmc.data_mining.peregrine.api.Peregrine;
import org.erasmusmc.data_mining.peregrine.disambiguator.api.DisambiguationDecisionMaker;
import org.erasmusmc.data_mining.peregrine.disambiguator.api.Disambiguator;
import org.erasmusmc.data_mining.peregrine.disambiguator.api.RuleDisambiguator;
import org.erasmusmc.data_mining.peregrine.disambiguator.impl.ThresholdDisambiguationDecisionMakerImpl;
import org.erasmusmc.data_mining.peregrine.disambiguator.impl.rule_based.LooseDisambiguator;
import org.erasmusmc.data_mining.peregrine.disambiguator.impl.rule_based.StrictDisambiguator;
import org.erasmusmc.data_mining.peregrine.disambiguator.impl.rule_based.TypeDisambiguatorImpl;
import org.erasmusmc.data_mining.peregrine.impl.hash.PeregrineImpl;
import org.erasmusmc.data_mining.peregrine.normalizer.api.NormalizerFactory;
import org.erasmusmc.data_mining.peregrine.normalizer.impl.LVGNormalizer;
import org.erasmusmc.data_mining.peregrine.normalizer.impl.NormalizerFactoryImpl;
import org.erasmusmc.data_mining.peregrine.tokenizer.api.TokenizerFactory;
import org.erasmusmc.data_mining.peregrine.tokenizer.impl.TokenizerFactoryImpl;
import org.erasmusmc.data_mining.peregrine.tokenizer.impl.UMLSGeneChemTokenizer;

@XmlRootElement
// JAX-RS supports an automatic mapping from JAXB annotated class to XML and JSON
// Isn't that cool?
public class Tag {
  
  private String summary;
  private String description;
  private String vocab;
  private String text;
  @XmlElementWrapper(name = "result")
  private ArrayList<TaggedTerm> taggedTerms;
  
  //Default constructor
  public Tag(){
	  this.vocab = "semweb";
	  this.text = "notext";
  }
  public Tag(String txt, String voc){
	  this.text = txt;
	  this.vocab = voc;
	  taggedTerms = new ArrayList<TaggedTerm>();
  }
  public ArrayList<TaggedTerm> getSummary() {
    return taggedTerms;
  }
  /*public void setSummary(String summary) {
    this.summary = summary;
  }*/
  public String getDescription() {
    return description;
  }
  public void setDescription(String description) {
    this.description = description;
  }
 

  /**
   * Print the indexing results that Peregrine returns.
   */
  public void setSummary(String summary){
	  String text = this.text;
	  String s = "";
      // The ontology file format is described here:
      // https://trac.nbic.nl/data-mining/wiki/ErasmusMC%20ontology%20file%20format
      //final String ontologyPath = "C:/Users/Nasko/Desktop/School/Project/semweb-peregrine.txt"; // EDIT HERE
	  final String ontologyPath = System.getProperty("user.home") + "/peregrine/" + vocab + "-peregrine.txt";
      final Ontology ontology = new SingleFileOntologyImpl(ontologyPath);

      //final String propertiesDirectory = "C:/Users/Nasko/Desktop/School/Project/lvg2006lite/data/config/"; // EDIT HERE
      final String propertiesDirectory = System.getProperty("user.home") + "/peregrine/lvg2006lite/data/config/";
      final Peregrine peregrine = createPeregrine(ontology, propertiesDirectory + "lvg.properties");
      //final String text = "This is a simple sentence with labels like earley, bielefeld, task model ontology, etc.  " +
      //                    "and immunoglobulin production, elsevier, Christian Morbidoni, Austria, Swingly, many terms like r2rml.";
      final List<IndexingResult> indexingResults = peregrine.indexAndDisambiguate(text, Language.EN);

      //System.out.println("Number of indexing results found: " + indexingResults.size() + ".");
      this.summary = "";
      for (final IndexingResult indexingResult : indexingResults) {
          final Serializable conceptId = indexingResult.getTermId().getConceptId();
          //System.out.println();
          //System.out.println("- Found concept with id: " + conceptId + ", matched text: \""
          //                   + text.substring(indexingResult.getStartPos(), indexingResult.getEndPos() + 1) + "\".");
          String matchedText = text.substring(indexingResult.getStartPos(), indexingResult.getEndPos() + 1);
          
          /* 
           * Get the Term context - but lock it within a sentance.
           */
          String termContext = "";
          int cStart;
          int cEnd;
          //Get Start position of "context" text
          if(indexingResult.getStartPos()-15 <= indexingResult.getSentenceStartPos()) cStart = indexingResult.getSentenceStartPos();
          else {
        	  int cS = indexingResult.getStartPos()-15;
        	  cStart = indexingResult.getStartPos() - (15-text.substring(cS, indexingResult.getStartPos() + 1).indexOf(" ")) + 1;
          }
          
          //Get End position of "context" text
          if(indexingResult.getEndPos()+15 >= indexingResult.getSentenceEndPos()) cEnd = indexingResult.getSentenceEndPos();
          else {
        	  int cE = indexingResult.getEndPos()+15;
        	  cEnd = indexingResult.getEndPos() + text.substring(indexingResult.getEndPos(), cE).lastIndexOf(" ") + 1;  
          }
          
          termContext = text.substring(cStart, cEnd).trim();
          /*String[] toTrim = text.substring(cStart, cEnd + 1).split(" ");
          String[] trimmed = Arrays.copyOfRange(toTrim, 1, toTrim.length-1);
          termContext = StringUtils.join(trimmed, " ");*/
          
          s = "- Found concept with id: " + conceptId + ", matched text: \""
                                   + matchedText + "\".";
          final Concept concept = ontology.getConcept(conceptId);
          final String preferredLabelText = LabelTypeComparator.getPreferredLabel(concept.getLabels()).getText();
          //System.out.println("  Preferred concept label is: \"" + preferredLabelText + "\".");
          s += "  Preferred concept label is: \"" + preferredLabelText + "\".";
          this.summary += s + Math.random()*10;
          TaggedTerm t = new TaggedTerm();
          t.setMatchedText(matchedText);
          t.setPrefLabel(preferredLabelText);
          
          
          //Set the label
          String definition = "";
          String hierarchy = "";
          
          for(Label d : concept.getLabels()){
        	  if(d.getText().contains("|DEFINITION|")){
        		  definition = d.getText().replace("|DEFINITION|", "");
        		  break;
        	  }
          }
          
          for(Label d : concept.getLabels()){
        	  if(d.getText().contains("|HIERARCHY|")){
        		  if(!hierarchy.equals("")) hierarchy += ";;" + d.getText().replace("TM |HIERARCHY|", "");
        		  else hierarchy += d.getText().replace("TM |HIERARCHY|", "");
        		  break;
        	  }
          }
          
          
          
          
          
          t.setDefinition(definition);
          t.setHierarchy(hierarchy);
          t.setTermContext(termContext);
          this.taggedTerms.add(t);
          definition = "";
          hierarchy = "";
      }
  }

  /**
   * Create a new peregrine object.
   *
   * @param ontology          the ontology to use.
   * @param lvgPropertiesPath the path to the lvg properties.
   * @return the new peregrine object.
   */
  private Peregrine createPeregrine(final Ontology ontology, final String lvgPropertiesPath) {
      final UMLSGeneChemTokenizer tokenizer = new UMLSGeneChemTokenizer();
      final TokenizerFactory tokenizerFactory = TokenizerFactoryImpl.createDefaultTokenizerFactory(tokenizer);
      final LVGNormalizer normalizer = new LVGNormalizer(lvgPropertiesPath);
      final NormalizerFactory normalizerFactory = NormalizerFactoryImpl.createDefaultNormalizerFactory(normalizer);
      final RuleDisambiguator[] disambiguators = {new StrictDisambiguator(), new LooseDisambiguator()};
      final Disambiguator disambiguator = new TypeDisambiguatorImpl(disambiguators);
      final DisambiguationDecisionMaker disambiguationDecisionMaker = new ThresholdDisambiguationDecisionMakerImpl();

      // This parameter is used to define the set of languages in which the ontology should be loaded. Language code
      // used is ISO639. For now, this feature is only available for DBOntology. Thus, we can leave it as null or
      // the empty string in this sample code.
      // final String ontologyLanguageToLoad = "en, nl, de";
      final String ontologyLanguageToLoad = null;

      return new PeregrineImpl(ontology, tokenizerFactory, normalizerFactory, disambiguator,
                               disambiguationDecisionMaker, ontologyLanguageToLoad);
  }
}
@XmlRootElement
class TaggedTerm {
	private String matchedText;
	private String prefLabel;
	private String definition="";
	private String termContext;
	private String hierarchy="";
	public TaggedTerm(){}
	public void setMatchedText(String text){
		this.matchedText = text;
	}
	public void setPrefLabel(String label){
		this.prefLabel = label;
	}
	public void setDefinition(String def){
		this.definition = def;
	}
	public void setTermContext(String tContext){
		this.termContext = tContext;
	}
	public void setHierarchy(String h){
		this.hierarchy = h;
	}
	public String getMatchedText(){
		return matchedText;
	}
	public String getPrefLabel(){
		return prefLabel;
	}
	public String getDefinition(){
		return definition;
	}
	public String getTermContext(){
		return termContext;
	}
	public String getHierarchy(){
		return hierarchy;
	}
}
  