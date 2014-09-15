# Valid

A web component for importing and validating excel files.


## Task Description

The RCC is assisting the University of Chicago's [Language Development
Project](http://ldp.uchicago.edu) with their transcript validation efforts.
LDP Research Assistants transcribe interactions between child subject's and
their caregivers and then code the transribed utterances for different aspects of speech and gesture.  These excel-based transcripts often contain minor formatting
errors, typos, and systematic mis-coding.  We would like to provide the
Research Assistants with a web-based interface for validating and submitting
their transcripts. 

There are two distinct parts for this task: **importing** and then **validating** the specified transcript data:  

* use [`js-xls`](https://github.com/SheetJS/js-xls) or [`js-xlsx`](https://github.com/SheetJS/js-xlsx) (depending on the filetype) for importing transcript data from excel files

* use [`joi`](https://github.com/hapijs/joi) for validating the imported transcript data

For the first phase of this project, we're going to provide two test files:
`test.xls` and `test.xlsx`.  You're job will be to import all the transcript
data from the worksheet named `transcript` and to then validate the third
column (**HANDS**), which can contain the codes `L` (for "left"), `R` (for "right") or `B` (for "both").  (You can think of this column as encoding the sequence of hands being used for gesturing while speaking.) 

| SUBJECT | SESSION | LINE | UTTERANCE     | HANDS | CONTEXT               |
----------|---------|------|---------------|-------|------------------------
| 22      | 2       | 1    | Hello.        | L     | waves with left hand
| 22      | 2       | 2    | Want some?    | B     | holds out both hands
| 22      | 2       | 3    | This or this? | L+R   | first left, then right
| 22      | 2       | 4    | Goodbye!      | R     | waves with right

Each field in third column can contain one or more of these three permissible codes, but multiple codes must be infixed with a `+`.  

For example, here are a few valid field values for the third column:

* `L`
* `L+R`
* `L+R+B`
* `L+L+L+R+B`

Here are a few invalid values:

* `X`
* `L+`
* `L-R `
* `l+r`
* `L + R`
* `L+R `
* ` L`


## People

* TJ (student lead)
* Jason (consulting)


## Status

Not yet started.


## Resources

* [excel parsing demo](http://oss.sheetjs.com/) - demonstrates how to detect
  incoming filetypes and parse excel files in the browser
* [excel parsing tutorial](http://codetheory.in/parse-read-excel-files-xls-xlsx-javascript/) - describes how to use `js-xls` and `js-xlsx` for parsing excel files.
* [joi tutorial](https://medium.com/the-spumko-suite/creating-validation-schemas-with-joi-eb4ff19f6688) - describes how to create validation schemas with `joi`.

