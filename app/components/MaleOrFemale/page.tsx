export default function MaleOrFemale () {
    interface MaleOrFemaleProps {
        name: string;
      }
      
    async function getGenderFromName({name} : MaleOrFemaleProps) {
        const res = await fetch(`https://api.genderize.io?name=${name}`);
        const data = await res.json();
        // data = { name: "John", gender: "male", probability: 0.99, count: 1234 }
        return data.gender; 
      }
      
    return {getGenderFromName}
}