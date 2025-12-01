// Упрощенный астрологический калькулятор на основе формул
// Используем упрощенные алгоритмы для работы в браузере

class AstrologyCore {
    constructor() {
        this.planets = {
            'Солнце': '☉',
            'Луна': '☽', 
            'Меркурий': '☿',
            'Венера': '♀',
            'Марс': '♂',
            'Юпитер': '♃',
            'Сатурн': '♄',
            'Уран': '♅',
            'Нептун': '♆',
            'Плутон': '♇'
        };
        
        this.zodiac = [
            'Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева',
            'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'
        ];
        
        this.timezones = {
            'Москва': 3,
            'Иваново': 3,
            'Липецк': 3,
            'Санкт-Петербург': 3
        };
    }
    
    // Преобразование даты в юлианский день (упрощенная формула)
    toJulianDay(date) {
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();
        const hour = date.getUTCHours() + date.getUTCMinutes()/60;
        
        let a = Math.floor((14 - month) / 12);
        let y = year + 4800 - a;
        let m = month + 12*a - 3;
        
        let jd = day + Math.floor((153*m + 2)/5) + 365*y + Math.floor(y/4) 
                 - Math.floor(y/100) + Math.floor(y/400) - 32045;
        
        jd += (hour - 12) / 24;
        
        return jd;
    }
    
    // Упрощенный расчет позиции Солнца (формула из астрономических алгоритмов)
    calculateSunPosition(jd) {
        // Количество юлианских столетий от эпохи J2000.0
        const T = (jd - 2451545.0) / 36525;
        
        // Средняя аномалия Солнца
        let M = 357.52911 + 35999.05029 * T - 0.0001537 * T*T;
        M = this.normalizeDegrees(M);
        
        // Уравнение центра
        const C = (1.914602 - 0.004817 * T - 0.000014 * T*T) * Math.sin(M * Math.PI/180)
                + (0.019993 - 0.000101 * T) * Math.sin(2 * M * Math.PI/180)
                + 0.000289 * Math.sin(3 * M * Math.PI/180);
        
        // Истинная долгота Солнца
        let L = 280.46646 + 36000.76983 * T + 0.0003032 * T*T + C;
        L = this.normalizeDegrees(L);
        
        return L;
    }
    
    // Расчет других планет (упрощенно, на основе Солнца)
    calculatePlanetPositions(jd) {
        const sunPos = this.calculateSunPosition(jd);
        const positions = {};
        
        // Упрощенные расчеты (в реальности нужны сложные эфемериды)
        // Это демонстрационные данные!
        
        positions['Солнце'] = {
            degrees: sunPos,
            speed: 1.0
        };
        
        // Луна: примерно на 12-15 градусов впереди Солнца
        positions['Луна'] = {
            degrees: (sunPos + 13.2) % 360,
            speed: 13.2
        };
        
        // Меркурий: в пределах 28 градусов от Солнца
        positions['Меркурий'] = {
            degrees: (sunPos + 18.7) % 360,
            speed: 1.6
        };
        
        // Венера: в пределах 48 градусов от Солнца
        positions['Венера'] = {
            degrees: (sunPos + 32.4) % 360,
            speed: 1.2
        };
        
        // Марс
        positions['Марс'] = {
            degrees: (sunPos + 145.3) % 360,
            speed: 0.5
        };
        
        // Юпитер
        positions['Юпитер'] = {
            degrees: (sunPos + 245.8) % 360,
            speed: 0.08
        };
        
        // Сатурн
        positions['Сатурн'] = {
            degrees: (sunPos + 295.2) % 360,
            speed: 0.03
        };
        
        // Уран
        positions['Уран'] = {
            degrees: (sunPos + 35.7) % 360,
            speed: 0.01
        };
        
        // Нептун
        positions['Нептун'] = {
            degrees: (sunPos + 325.9) % 360,
            speed: 0.006
        };
        
        // Плутон
        positions['Плутон'] = {
            degrees: (sunPos + 265.4) % 360,
            speed: 0.004
        };
        
        return positions;
    }
    
    // Нормализация градусов в диапазон 0-360
    normalizeDegrees(degrees) {
        let normalized = degrees % 360;
        if (normalized < 0) normalized += 360;
        return normalized;
    }
    
    // Конвертация градусов в знак зодиака
    degreesToZodiac(degrees) {
        const signIndex = Math.floor(degrees / 30);
        const degreesInSign = (degrees % 30).toFixed(2);
        return {
            sign: this.zodiac[signIndex],
            degrees: parseFloat(degreesInSign),
            fullDegrees: degrees.toFixed(2)
        };
    }
    
    // Расчет для конкретного города
    calculateForCity(date, cityName) {
        // Поправка на часовой пояс
        const timezoneOffset = this.timezones[cityName];
        const localDate = new Date(date);
        
        // Преобразование в UTC с учетом часового пояса
        const utcDate = new Date(localDate.getTime() - timezoneOffset * 3600000);
        
        const jd = this.toJulianDay(utcDate);
        const positions = this.calculatePlanetPositions(jd);
        
        const result = {
            city: cityName,
            localTime: localDate.toLocaleString('ru-RU', {
                timeZone: 'Europe/Moscow',
                hour12: false
            }),
            utcTime: utcDate.toISOString(),
            planets: {}
        };
        
        // Обработка каждой планеты
        for (const [planetName, data] of Object.entries(positions)) {
            const zodiacInfo = this.degreesToZodiac(data.degrees);
            result.planets[planetName] = {
                symbol: this.planets[planetName],
                sign: zodiacInfo.sign,
                degrees: zodiacInfo.degrees,
                fullPosition: zodiacInfo.fullDegrees,
                speed: data.speed.toFixed(3)
            };
        }
        
        return result;
    }
}

// Экспортируем глобально для использования
window.AstrologyCore = AstrologyCore;
