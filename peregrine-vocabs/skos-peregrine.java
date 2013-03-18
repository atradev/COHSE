package examples;

import org.semanticweb.skosapibinding.SKOSManager;
import org.semanticweb.skos.*;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URI;
/*
 * Copyright (C) 2007, University of Manchester
 *
 * Modifications to the initial code base are copyright of their
 * respective authors, or their employers as appropriate.  Authorship
 * of the modifications may be determined from the ChangeLog placed at
 * the end of this file.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.

 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.

 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */
import java.util.ArrayList;

/**
 * Author: Simon Jupp<br>
 * Date: Sep 8, 2008<br>
 * The University of Manchester<br>
 * Bio-Health Informatics Group<br>
 */
public class Example1n {

    public static void main(String[] args) {

        /*
        * How to load a SKOS vocabulay and print out the concepts and any assertions on these
        * The main object in the API include a SKOSManager which manages the loading, saving a dn editing of dataset,
        * The SKOSDataset object is a container for your SKOS vocabularies, each manager can have multiple dataset which
        * are accessed via a URIs. Finally there is a SKOSDataFactory object for creating and retrieving SKOSObject from your dataset.
         */

    	
    	FileWriter fw;
    	BufferedWriter bw = null;
        try {
        	File file = new File("C:/Users/Nasko/Desktop/School/Project/diving-peregrine2.txt");
        	 
			// if file doesnt exists, then create it
			if (!file.exists()) {
				file.createNewFile();
			}
 
			fw = new FileWriter(file.getAbsoluteFile());
			bw = new BufferedWriter(fw);
            // First create a new SKOSManager
            SKOSManager manager = new SKOSManager();

            // use the manager to load a SKOS vocabulary from a URI (either physical or on the web)

            SKOSDataset dataset = manager.loadDataset(URI.create("file:C:/Users/Nasko/Desktop/School/Project/diving.rdf"));
            //"file:/Users/simon/ontologies/skos/apitest.owl"
            //"http://potato.cs.man.ac.uk/seanb/skos/diving-skos.rdf"

            // get all the concepts in this vocabulay and print out the URI
            int id = 1;
            bw.write("# ErasmusMC ontology file" + "\n");
            bw.write("VR 1.0" + "\n");
            bw.write("ON Test SKOS Conv 01" + "\n");
            for (SKOSConcept concept : dataset.getSKOSConcepts()) {
            	
                //bw.write("Concept: " + concept.getURI());

                /*
                * SKOS entities such as Concepts, ConceptSchemes (See SKOSEntity in Javadoc for full list), are related to other
                * entities or literal values by three different types of relationships.
                * ObjectPropertyAssertions - These are relationships between two SKOS entities
                * DataPropertyAssertion - These relate entities to Literal values
                * SKOSAnnotation - These are either literal or entity annotation on a particular entity
                 */

                // print out object assertions

                //bw.write("\tObject property assertions:");
                for (SKOSObjectRelationAssertion objectAssertion : dataset.getSKOSObjectRelationAssertions(concept)) {
                    //bw.write("\t\t" + objectAssertion.getSKOSProperty().getURI().getFragment() + " " + objectAssertion.getSKOSObject().getURI().getFragment());
                    
                }
                bw.write("");
                

                // print out any data property assertions
                //bw.write("\tData property assertions:");
            	/*
                for (SKOSDataRelationAssertion assertion : dataset.getSKOSDataRelationAssertions(concept)) {

                    // the object of a data assertion can be either a typed or untyped literal
                    SKOSLiteral literal = assertion.getSKOSObject();
                    String lang = "";
                    if (literal.isTyped()) {

                        SKOSTypedLiteral typedLiteral = literal.getAsSKOSTypedLiteral();
                        bw.write("\t\t" + assertion.getSKOSProperty().getURI().getFragment() + " " + literal.getLiteral() + " Type:" + typedLiteral.getDataType().getURI() );
                    }
                    else {

                        // if it has  language
                        SKOSUntypedLiteral untypedLiteral = literal.getAsSKOSUntypedLiteral();
                        if (untypedLiteral.hasLang()) {
                            lang = untypedLiteral.getLang();
                        }
                        bw.write("\t\t" + assertion.getSKOSProperty().getURI().getFragment() + " " + literal.getLiteral() + " Lang:" + lang);

                    }
                }
                bw.write("");
                */
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
/*
                // finally get any OWL annotations - the object of a annotation property can be a literal or an entity
                //bw.write("\tAnnotation property assertions:");
                ArrayList<String> prefLabels = new ArrayList<String>();
                ArrayList<String> altLabels = new ArrayList<String>();
                //ArrayList<String> definitions = new ArrayList<String>();
                //Not sure how multi-language support for definitions works with Peregrine.
                String definition = "";
                String na = "";
                for (SKOSAnnotation assertion : dataset.getSKOSAnnotations(concept)) {
                	if(assertion.getURI().getFragment() != null &&
                			(assertion.getURI().getFragment().equalsIgnoreCase("prefLabel") || 
                			assertion.getURI().getFragment().equalsIgnoreCase("altLabel") ||
                			assertion.getURI().getFragment().equalsIgnoreCase("definition"))){
	                    // if the annotation is a literal annotation?
	                    String lang = "";
	                    String value = "";
	                    
	                    if (assertion.isAnnotationByConstant()) {
	
	                        SKOSLiteral literal = assertion.getAnnotationValueAsConstant();
	                        value = literal.getLiteral();
	                        if (!literal.isTyped()) {
	                            // if it has  language
	                            SKOSUntypedLiteral untypedLiteral = literal.getAsSKOSUntypedLiteral();
	                            if (untypedLiteral.hasLang()) {
	                                lang = untypedLiteral.getLang();
	                            }
	                        }
	                    }
	                    else {
	                        // annotation is some resource
	                        SKOSEntity entity = assertion.getAnnotationValue();
	                        value = entity.getURI().getFragment();
	                    }
	                    //Get it to look like
	                    //TM Malaria	@lang=es;match=ci,no
	                    if(assertion.getURI().getFragment().equalsIgnoreCase("prefLabel")){
	                    	if(na == "") na = value;
	                    	String s = "TM " +value +"\t";
	                    	if(lang.length() > 1) s += "@lang=" + lang + ";";
	                    	s += "match=ci,no";
	                    	prefLabels.add(s);
	                    }
	                    if(assertion.getURI().getFragment().equalsIgnoreCase("altLabel")){
	                    	if(na == "") na = value;
	                    	String s = "TM " + value +"\t";
	                    	if(lang.length() > 1) s += "@lang=" + lang + ";";
	                    	s += "match=ci,no";
	                    	altLabels.add(s);
	                    }
	                    if(assertion.getURI().getFragment().equalsIgnoreCase("definition")){
	                    	if(definition == ""){
	                    		definition = value;
	                    	}
	                    	
	                    }
	                    //bw.write("\t\t" + assertion.getURI().getFragment() + " " + value + " Lang:" + lang);
                	}
                	
                }
*/
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                // finally get any OWL annotations - the object of a annotation property can be a literal or an entity
                //bw.write("\tAnnotation property assertions:");
                ArrayList<String> prefLabels = new ArrayList<String>();
                ArrayList<String> altLabels = new ArrayList<String>();
                //ArrayList<String> definitions = new ArrayList<String>();
                //Not sure how multi-language support for definitions works with Peregrine.
                String definition = "";
                String na = "";
                for (SKOSDataRelationAssertion assertion : dataset.getSKOSDataRelationAssertions(concept)) {
                	if(assertion.getSKOSProperty().getURI().getFragment() != null &&
                			(assertion.getSKOSProperty().getURI().getFragment().equalsIgnoreCase("prefLabel") || 
                			assertion.getSKOSProperty().getURI().getFragment().equalsIgnoreCase("altLabel") ||
                			assertion.getSKOSProperty().getURI().getFragment().equalsIgnoreCase("definition"))){
	                    // if the annotation is a literal annotation?
	                    String lang = "";
	                    String value = "";
	                    
	                   
	                        SKOSLiteral literal = assertion.getSKOSObject();
	                        value = literal.getLiteral();
	                        if (!literal.isTyped()) {
	                            // if it has  language
	                            SKOSUntypedLiteral untypedLiteral = literal.getAsSKOSUntypedLiteral();
	                            if (untypedLiteral.hasLang()) {
	                                lang = untypedLiteral.getLang();
	                            }
	                        }
	                    
	                    //Get it to look like
	                    //TM Malaria	@lang=es;match=ci,no
	                    if(assertion.getSKOSProperty().getURI().getFragment().equalsIgnoreCase("prefLabel")){
	                    	if(na == "") na = value;
	                    	String s = "TM " +value +"\t";
	                    	if(lang.length() > 1) s += "@lang=" + lang + ";";
	                    	s += "match=ci,no";
	                    	prefLabels.add(s);
	                    }
	                    if(assertion.getSKOSProperty().getURI().getFragment().equalsIgnoreCase("altLabel")){
	                    	if(na == "") na = value;
	                    	String s = "TM " + value +"\t";
	                    	if(lang.length() > 1) s += "@lang=" + lang + ";";
	                    	s += "match=ci,no";
	                    	altLabels.add(s);
	                    }
	                    if(assertion.getSKOSProperty().getURI().getFragment().equalsIgnoreCase("definition")){
	                    	if(definition == ""){
	                    		definition = value.trim().replaceAll("\\s+", " ");
	                    	}
	                    	
	                    }
	                    //bw.write("\t\t" + assertion.getURI().getFragment() + " " + value + " Lang:" + lang);
                	}
                	
                }      
                
                
                
                
                
                
                System.out.println("\tObject property assertions:");
                for (SKOSObjectRelationAssertion objectAssertion : dataset.getSKOSObjectRelationAssertions(concept)) {
                    System.out.println("\t\t" + objectAssertion.getSKOSProperty().getURI().getFragment() + " " + objectAssertion.getSKOSObject().getURI().getFragment());
                    
                }
                System.out.println("");
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                id++;
                bw.write("--" + "\n");
                bw.write("ID " + id + "\n");
                bw.write("NA " + na + "\n");
                for(String str : prefLabels){
                	bw.write(str + "\n");
                }
                for(String str : altLabels){
                	bw.write(str + "\n");
                }
                if(definition != "") bw.write("DF " + definition.replaceAll("(\\r|\\n)", "") + "\n");
            }
            bw.write("--");
        } catch (SKOSCreationException e) {
            e.printStackTrace();
        }
        catch (IOException e){
        	e.printStackTrace();
        }
        finally {
        	try {
				bw.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
        }
    }
}
