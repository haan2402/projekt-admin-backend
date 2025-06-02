## Projekt - Administrations-gränssnitt för Bistro Norr
Denna del av projektet går ut på att skapa en webbplats för personalen där de kan logga in till en admin-sida som är en skyddad sida, där ska de kunna lägga till
maträtter i menyn, ändra en maträtt och kunna radera en maträtt. Jag har gjort denna del som en fristående webbplats från restaurang webbplatsen, men denna sida hämtar också
data från REST-webbtjänsten jag skapat. 

## Upplägg för webbplatsen
- **Startsida**: Inloggning där endast behöriga användare kan logga in sig, vid ogiltig inloggning så kommer ett felmeddelande upp,
vid lyckad inloggning så skickas användaren vidare till admin-sidan.
- **Admin-sida**: Här finns ett formulär för att lägga till nya maträtter till menyn, en lista som visar befintliga maträtter i menyn, en knapp för att
ändra en maträtt etfer ID, och en knapp för att radera en maträtt efter ID.

## login.js
Funktion för login.js:
- loginUser, med hjälp av POST så loggas en giltig användare in, validering av användarnamn och lösenord.

## main.js
Funktioner för main.js:
- **registerDish**: funktion för att f´ge funktion för formuläret, antingen kan man lägga till ny maträtt, eller om man trycker på "ändra" knappen i 
listan skrollas man upp till formuläret för att kunna redigera en maträtt.
- **getMenu**: hämtar data till listan av maträtter.
- **writeMenu**: skriver ut menyn i listan, samt lägger till en "ändra" och "radera" knapp.
- **removeDish**: raderar en maträtt efter ID
- **editDish**: gör så man skrollas upp till formuläret och sedan kan redigera maträtten efter ID

### Av
Hanna Angeria, haan2402@student.miun.se
