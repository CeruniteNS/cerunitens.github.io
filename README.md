# Keyword-Fruit Association
A simple web page that associates keywords to fruits. The dropdown list will show suggested and other fruits based on past associations in terms of their frequencies. This persistence of associations was implemented using the [Firebase Realtime Database](https://firebase.google.com/products/realtime-database) service.

Link to web page: https://cerunitens.github.io/

### Assumptions
- If either the keyword or fruit is missing, an error message will be displayed.
- Keywords are case-sensitive.
- Keywords can contain digits and symbols.
- Data are persistent between different browsers and devices.
- Suggested fruits are ordered in ascending order based on frequency.
